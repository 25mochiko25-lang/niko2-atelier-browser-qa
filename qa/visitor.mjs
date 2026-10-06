import fs from 'node:fs';
import path from 'node:path';
import { webkit } from 'playwright';

const TARGET = process.env.TARGET || 'https://niko2-atelier-combined-preview.25mochiko25.workers.dev/';
const PERSONA = process.env.PERSONA || 'first-time';
const SEED = process.env.SEED || PERSONA;
const MAX_STEPS = Math.max(4, Math.min(30, Number(process.env.MAX_STEPS || 18)));
const OUT = process.env.OUT || 'qa-output/result.json';

const allowed = (u) => {
  const x = new URL(u);
  return x.protocol === 'https:' && (
    x.hostname === 'niko2atelier.com' ||
    x.hostname.endsWith('.niko2atelier.com') ||
    (x.hostname.endsWith('.workers.dev') && /niko2[-]?atelier/i.test(x.hostname))
  );
};
if (!allowed(TARGET)) throw new Error('Target host is not on the NIKO² ATELIER allowlist: ' + TARGET);

function hashSeed(s) {
  let h = 2166136261 >>> 0;
  for (const ch of String(s)) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
let rngState = hashSeed(SEED) || 1;
function rand() {
  rngState ^= rngState << 13; rngState >>>= 0;
  rngState ^= rngState >>> 17; rngState >>>= 0;
  rngState ^= rngState << 5; rngState >>>= 0;
  return (rngState >>> 0) / 4294967296;
}

const report = {
  target: TARGET,
  persona: PERSONA,
  seed: SEED,
  maxSteps: MAX_STEPS,
  startedAt: new Date().toISOString(),
  engine: 'webkit',
  viewport: { width: 390, height: 844 },
  touch: true,
  events: [],
  snapshots: [],
  pageErrors: [],
  consoleErrors: [],
  requestFailures: []
};

function short(s, n = 180) {
  return String(s || '').replace(/\s+/g, ' ').trim().slice(0, n);
}

async function snapshot(page, label) {
  const s = await page.evaluate(() => {
    const visible = (e) => {
      if (!e) return false;
      const cs = getComputedStyle(e);
      const r = e.getBoundingClientRect();
      return r.width > 2 && r.height > 2 &&
        cs.display !== 'none' && cs.visibility !== 'hidden' &&
        Number(cs.opacity || 1) > 0.01 && !e.closest('[hidden]');
    };
    const els = [...document.querySelectorAll('button,a,[role="button"],summary,input[type="button"],input[type="submit"]')]
      .filter(visible)
      .filter(e => {
        const r = e.getBoundingClientRect();
        return r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
      });
    els.forEach((e, i) => e.setAttribute('data-qa-probe-id', String(i)));
    const clickables = els.slice(0, 40).map((e, i) => {
      const r = e.getBoundingClientRect();
      return {
        probe: i,
        tag: e.tagName,
        id: e.id || '',
        cls: (e.className && typeof e.className === 'string') ? e.className.slice(0, 160) : '',
        text: (e.innerText || e.getAttribute('aria-label') || e.getAttribute('title') || e.value || '').trim().replace(/\s+/g, ' ').slice(0, 180),
        href: e.getAttribute('href') || '',
        disabled: !!e.disabled,
        rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }
      };
    });
    const active = document.querySelector('.view.is-active');
    return {
      url: location.href,
      title: document.title,
      hash: location.hash,
      route: active?.dataset?.view || null,
      activeViews: document.querySelectorAll('.view.is-active').length,
      scroll: {
        x: Math.round(scrollX), y: Math.round(scrollY),
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight
      },
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 3,
      dialogs: [...document.querySelectorAll('dialog[open],[aria-modal="true"]')].filter(visible).map(e => e.id || e.getAttribute('aria-label') || e.tagName),
      bodyText: (document.body.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 1800),
      clickables
    };
  }).catch(e => ({ stateError: String(e) }));
  report.snapshots.push({ label, ...s });
  return s;
}

function utilityPenalty(c) {
  const t = (c.text + ' ' + c.id + ' ' + c.cls).toLowerCase();
  let p = 0;
  if (/sound|mute|音|menu|メニュー/.test(t)) p += 2200;
  if (/back|戻る|home|ホーム/.test(t)) p += 1300;
  if (/close|閉じる|×/.test(t)) p += 650;
  return p;
}

function score(c, persona, idx) {
  const area = Math.min(120000, c.rect.w * c.rect.h);
  const cx = c.rect.x + c.rect.w / 2;
  const cy = c.rect.y + c.rect.h / 2;
  const centerBonus = Math.max(0, 800 - Math.abs(cx - 195) * 1.4 - Math.abs(cy - 422) * 0.45);
  const textBonus = c.text ? 450 : 0;
  const disabledPenalty = c.disabled ? 999999 : 0;
  const t = (c.text + ' ' + c.id + ' ' + c.cls).toLowerCase();
  let semantic = 0;
  if (/enter|open|start|dream|見る|入る|はじめ|進む|continue|next/.test(t)) semantic += 420;
  if (/about|privacy|rights|contact/.test(t)) semantic -= persona === 'wanderer' ? 0 : 180;

  let personaBias = 0;
  if (persona === 'wanderer') personaBias = idx * 65 + (idx > 0 ? 500 : -250);
  if (persona === 'sloppy-mobile') personaBias = (4 - Math.min(idx, 4)) * 100 + rand() * 500;
  if (persona === 'outside-critic') personaBias = textBonus + Math.min(c.rect.w, 280);
  if (persona === 'genre-fan') personaBias = semantic * 0.8 + rand() * 260;
  if (persona === 'first-time') personaBias = rand() * 180;

  return area * 0.012 + centerBonus + textBonus + semantic + personaBias - utilityPenalty(c) - disabledPenalty;
}

function chooseCandidate(s) {
  const candidates = (s.clickables || []).filter(c => !c.disabled);
  if (!candidates.length) return null;
  return candidates
    .map((c, i) => ({ c, v: score(c, PERSONA, i) }))
    .sort((a, b) => b.v - a.v)[0]?.c || null;
}

async function tapCandidate(page, c, label, extra = {}) {
  const before = await snapshot(page, label + ':before');
  let error = null;
  try {
    const loc = page.locator('[data-qa-probe-id="' + c.probe + '"]').first();
    await loc.tap({ timeout: 4500 });
  } catch (e) {
    error = String(e);
  }
  await page.waitForTimeout(extra.wait ?? 420).catch(() => {});
  const after = await snapshot(page, label + ':after');
  report.events.push({
    kind: 'tap',
    label,
    target: { text: c.text, id: c.id, cls: c.cls, href: c.href, rect: c.rect },
    error,
    before: { url: before.url, route: before.route, hash: before.hash, scroll: before.scroll },
    after: { url: after.url, route: after.route, hash: after.hash, scroll: after.scroll }
  });
  return { before, after, error };
}

async function navEvent(page, kind, fn) {
  const before = await snapshot(page, kind + ':before');
  let error = null;
  try { await fn(); } catch (e) { error = String(e); }
  await page.waitForTimeout(500).catch(() => {});
  const after = await snapshot(page, kind + ':after');
  report.events.push({
    kind, error,
    before: { url: before.url, route: before.route, hash: before.hash, scroll: before.scroll },
    after: { url: after.url, route: after.route, hash: after.hash, scroll: after.scroll }
  });
}

function scheduledAction(step) {
  if (PERSONA === 'sloppy-mobile') {
    if (step === 3 || step === 11) return 'scroll';
    if (step === 5) return 'back';
    if (step === 6) return 'forward';
    if (step === 9) return 'reload';
  }
  if (PERSONA === 'wanderer') {
    if (step === 4) return 'back';
    if (step === 5) return 'forward';
    if (step === 8 || step === 13) return 'scroll';
    if (step === 11) return 'reload';
  }
  if (PERSONA === 'outside-critic') {
    if (step === 4 || step === 8 || step === 12) return 'scroll';
    if (step === 10) return 'back';
  }
  if (PERSONA === 'genre-fan') {
    if (step === 5 || step === 12) return 'scroll';
    if (step === 14) return 'back';
    if (step === 15) return 'forward';
  }
  if (PERSONA === 'first-time') {
    if (step === 6 || step === 12) return 'scroll';
  }
  return 'tap';
}

(async () => {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const browser = await webkit.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    locale: 'ja-JP',
    timezoneId: 'Asia/Tokyo',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1'
  });
  const page = await context.newPage();

  page.on('pageerror', e => report.pageErrors.push(short(e, 500)));
  page.on('console', m => { if (m.type() === 'error') report.consoleErrors.push(short(m.text(), 500)); });
  page.on('requestfailed', r => report.requestFailures.push({ url: short(r.url(), 500), error: short(r.failure()?.errorText, 300) }));

  try {
    const response = await page.goto(TARGET, { waitUntil: 'domcontentloaded', timeout: 25000 });
    report.httpStatus = response?.status() ?? null;
    await page.waitForTimeout(900);
    await snapshot(page, 'arrival');

    for (let step = 1; step <= MAX_STEPS; step++) {
      const action = scheduledAction(step);

      if (action === 'scroll') {
        const amount = PERSONA === 'sloppy-mobile' ? 620 : 430 + Math.floor(rand() * 420);
        await navEvent(page, 'scroll-' + step, async () => {
          await page.evaluate(y => window.scrollBy({ top: y, behavior: 'auto' }), amount);
        });
        continue;
      }
      if (action === 'back') {
        await navEvent(page, 'back-' + step, async () => { await page.goBack({ waitUntil: 'domcontentloaded', timeout: 7000 }).catch(() => null); });
        continue;
      }
      if (action === 'forward') {
        await navEvent(page, 'forward-' + step, async () => { await page.goForward({ waitUntil: 'domcontentloaded', timeout: 7000 }).catch(() => null); });
        continue;
      }
      if (action === 'reload') {
        await navEvent(page, 'reload-' + step, async () => { await page.reload({ waitUntil: 'domcontentloaded', timeout: 12000 }); });
        continue;
      }

      const s = await snapshot(page, 'step-' + step + '-choice');
      const c = chooseCandidate(s);
      if (!c) {
        await navEvent(page, 'no-target-scroll-' + step, async () => {
          await page.evaluate(() => window.scrollBy({ top: Math.round(innerHeight * 0.68), behavior: 'auto' }));
        });
        continue;
      }

      await tapCandidate(page, c, 'step-' + step + '-tap');

      if (PERSONA === 'sloppy-mobile' && (step === 2 || step === 7) && rand() > 0.25) {
        const post = await snapshot(page, 'step-' + step + '-impatient-choice');
        const sameish = (post.clickables || []).find(x => x.text && x.text === c.text);
        if (sameish) {
          await tapCandidate(page, sameish, 'step-' + step + '-impatient-second-tap', { wait: 220 });
        }
      }
    }

    report.final = await snapshot(page, 'final');
  } catch (e) {
    report.fatal = String(e?.stack || e);
  } finally {
    report.finishedAt = new Date().toISOString();
    fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
    await context.close().catch(() => {});
    await browser.close().catch(() => {});
  }

  console.log(JSON.stringify({
    persona: report.persona,
    target: report.target,
    httpStatus: report.httpStatus,
    events: report.events.length,
    snapshots: report.snapshots.length,
    pageErrors: report.pageErrors.length,
    consoleErrors: report.consoleErrors.length,
    requestFailures: report.requestFailures.length,
    fatal: report.fatal || null,
    finalRoute: report.final?.route || null,
    finalUrl: report.final?.url || null
  }));
})();
