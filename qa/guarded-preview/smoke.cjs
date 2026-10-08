'use strict';

// Deterministic regression checks, NOT a first-time visitor's impressions.
// No DOM-triggered click, storage seeding, site writes or Production navigation.
const fs = require('node:fs');
const path = require('node:path');
const { chromium, firefox, webkit } = require('/tmp/niko2-guarded-qa/node_modules/playwright');
const { TARGET, validateTarget, aggregate } = require('./policy.cjs');

const mode = process.env.MODE || 'check';
if (!['check', 'smoke', 'full'].includes(mode)) throw new Error('Unknown smoke mode');
validateTarget(process.env.TARGET || TARGET);

const profiles = [
  { id: 'founder-webkit-430', engine: 'webkit', mobile: true, width: 430, height: 932 },
  { id: 'small-webkit-390', engine: 'webkit', mobile: true, width: 390, height: 844 },
  { id: 'android-like-chromium-390', engine: 'chromium', mobile: true, width: 390, height: 844 },
  { id: 'desktop-chromium-1440', engine: 'chromium', mobile: false, width: 1440, height: 900 },
  { id: 'desktop-webkit-1440', engine: 'webkit', mobile: false, width: 1440, height: 900 }
];
if (mode === 'full') profiles.push(
  { id: 'desktop-firefox-1440', engine: 'firefox', mobile: false, width: 1440, height: 900 },
  { id: 'narrow-chromium-360', engine: 'chromium', mobile: true, width: 360, height: 780 }
);

const engines = { webkit, chromium, firefox };
const report = {
  target: TARGET,
  at: new Date().toISOString(),
  mode,
  scope: 'Entry/intro/Garden navigation and layout diagnostics only; not Diary swipe, full map, rights, data persistence, audio, physical devices, or release approval.',
  devices: [],
  status: 'UNKNOWN'
};

const safeName = name => name.replace(/[^a-z0-9_-]/gi, '-');
const pause = (page, ms) => page.waitForTimeout(ms);
function isVisible(e) {
  if (!e) return false;
  const rect = e.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2) return false;
  for (let node = e; node; node = node.parentElement) {
    const style = getComputedStyle(node);
    if (node.hidden || style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) < 0.05) return false;
  }
  return true;
}
async function observe(page) {
  return await page.evaluate(() => {
    function shown(e) {
      if (!e) return false;
      const r = e.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return false;
      for (let n = e; n; n = n.parentElement) {
        const s = getComputedStyle(n);
        if (n.hidden || s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity) < 0.05) return false;
      }
      return true;
    }
    return {
      route: document.querySelector('.view.is-active')?.dataset.view || null,
      intro: [...document.querySelectorAll('.niko2-intro-primary')].some(shown),
      begin: shown(document.querySelector('#beginGarden')),
      enter: shown(document.querySelector('#enterGarden')),
      bodyChars: (document.body?.innerText || '').trim().length,
      overflowPx: Math.max(0, document.documentElement.scrollWidth - innerWidth),
      href: location.href
    };
  });
}
async function visibleLocator(page, selector) {
  const loc = page.locator(selector);
  const count = Math.min(await loc.count(), 15);
  for (let i = 0; i < count; i++) {
    const item = loc.nth(i);
    if (await item.isVisible()) return item;
  }
  return null;
}
async function coordinatePress(page, selector, mobile, rec) {
  const loc = await visibleLocator(page, selector);
  if (!loc) return false;
  const box = await loc.boundingBox();
  if (!box) return false;
  const vw = page.viewportSize().width, vh = page.viewportSize().height;
  const left = Math.max(0, box.x), top = Math.max(0, box.y);
  const right = Math.min(vw, box.x + box.width), bottom = Math.min(vh, box.y + box.height);
  if (right - left < 3 || bottom - top < 3) throw Error('Visible target lacks an on-screen hit area: ' + selector);
  const x = Math.round((left + right) / 2), y = Math.round((top + bottom) / 2);
  const hit = await loc.evaluate((node, point) => {
    const top = document.elementFromPoint(point.x, point.y);
    return !!top && (top === node || node.contains(top));
  }, { x, y }).catch(() => false);
  rec.actions.push({ kind: mobile ? 'touchscreen.tap' : 'mouse.click', selector, x, y, unobstructed: hit });
  if (mobile) await page.touchscreen.tap(x, y);
  else await page.mouse.click(x, y);
  return true;
}
function entryOutcome(s) {
  return !!(s && (s.intro || s.begin || (s.route && s.route !== 'home')));
}
async function poll(page, test, attempts = 10, gap = 650) {
  for (let i = 0; i < attempts; i++) {
    const s = await observe(page);
    if (test(s)) return s;
    if (i !== attempts - 1) await pause(page, gap);
  }
  return await observe(page);
}
async function checkProfile(browser, spec) {
  const rec = { id: spec.id, engine: spec.engine, viewport: [spec.width, spec.height],
    input: spec.mobile ? 'Playwright touchscreen tap' : 'Playwright mouse click',
    status: 'UNKNOWN', reason: null, actions: [], diagnostics: [], pageErrors: [], httpErrors: [],
    blockedWrites: [] };
  report.devices.push(rec);
  const context = await browser.newContext({
    viewport: { width: spec.width, height: spec.height },
    isMobile: spec.mobile,
    hasTouch: spec.mobile,
    locale: 'ja-JP',
    timezoneId: 'Asia/Tokyo'
  });
  let page;
  try {
    page = await context.newPage();
    page.on('pageerror', e => rec.pageErrors.push(String(e).slice(0, 350)));
    page.on('response', r => {
      if (r.url().startsWith(TARGET) && r.status() >= 400) rec.httpErrors.push({ status: r.status(), path: new URL(r.url()).pathname });
    });
    await page.route('**/*', async route => {
      const request = route.request();
      const method = request.method().toUpperCase();
      if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
        rec.blockedWrites.push({ method, path: new URL(request.url()).pathname });
        await route.abort('blockedbyclient');
        return;
      }
      if (request.isNavigationRequest() && new URL(request.url()).origin !== new URL(TARGET).origin) {
        await route.abort('blockedbyclient');
        return;
      }
      await route.continue();
    });
    const response = await page.goto(TARGET, { waitUntil: 'domcontentloaded', timeout: 25000 });
    if (!response || response.status() !== 200) throw Error('Preview HTTP ' + (response ? response.status() : 'no response'));
    await pause(page, 1100);
    const initial = await observe(page);
    rec.diagnostics.push({ stage: 'arrival', state: initial });
    if (initial.bodyChars < 10) { rec.reason = 'UNKNOWN: browser page is unexpectedly sparse'; return; }
    if (initial.overflowPx > 8) rec.diagnostics.push({ stage: 'horizontal-overflow', px: initial.overflowPx, note: 'Diagnostic only: intentional framing may overflow' });
    if (!initial.enter) { rec.reason = 'UNKNOWN: #enterGarden not visible in this fresh state'; return; }
    await coordinatePress(page, '#enterGarden', spec.mobile, rec);
    const entered = await poll(page, entryOutcome, 11, 700);
    rec.diagnostics.push({ stage: 'after-entry-tap', state: entered });
    if (!entryOutcome(entered)) { rec.status = 'FAIL'; rec.reason = 'A real-coordinate entry tap did not reveal Intro/Garden'; return; }
    for (let i = 0; i < 8; i++) {
      const state = await observe(page);
      if (!state.intro) break;
      const pressed = await coordinatePress(page, '.niko2-intro-primary', spec.mobile, rec);
      if (!pressed) break;
      await pause(page, 650);
    }
    let state = await observe(page);
    if (state.begin) {
      await coordinatePress(page, '#beginGarden', spec.mobile, rec);
      state = await poll(page, s => !!s.route && s.route !== 'home', 11, 700);
    }
    rec.diagnostics.push({ stage: 'after-intro', state });
    if (rec.pageErrors.length) { rec.reason = 'UNKNOWN: unhandled JS errors during entry'; return; }
    if (rec.blockedWrites.length) { rec.reason = 'UNKNOWN: a site write was blocked by read-only browser policy'; return; }
    if (!state.route || state.route === 'home') {
      rec.reason = 'UNKNOWN: entry changed visible state but Garden route not verified';
      return;
    }
    rec.status = 'PASS';
    rec.reason = 'Entry and primary route transition observed from actual coordinates';
  } catch (err) {
    rec.status = 'FAIL';
    rec.reason = String(err).slice(0, 650);
  } finally {
    if (page && rec.status !== 'PASS') {
      fs.mkdirSync('qa-output/failures', { recursive: true });
      await page.screenshot({ path: path.join('qa-output/failures', safeName(spec.id) + '.jpg'), type: 'jpeg', quality: 75, timeout: 8000 }).catch(() => {});
    }
    await context.close().catch(() => {});
  }
}
async function main() {
  fs.mkdirSync('qa-output', { recursive: true });
  const opened = new Map();
  try {
    for (const spec of profiles) {
      if (!opened.has(spec.engine)) opened.set(spec.engine, await engines[spec.engine].launch({ headless: true }));
      await checkProfile(opened.get(spec.engine), spec);
      console.log(JSON.stringify({ device: spec.id, status: report.devices.at(-1).status, reason: report.devices.at(-1).reason }));
    }
  } catch (err) {
    report.runError = String(err);
  } finally {
    await Promise.allSettled([...opened.values()].map(browser => browser.close()));
    report.status = report.runError ? 'UNKNOWN' : aggregate(report.devices);
    fs.writeFileSync('qa-output/smoke.json', JSON.stringify(report, null, 2) + '\n');
    if (process.env.GITHUB_STEP_SUMMARY) {
      fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, '### Read-only browser entry smoke\n' +
        '- Result: **' + report.status + '**\n' +
        report.devices.map(x => '- ' + x.id + ': ' + x.status + ' (' + x.reason + ')').join('\n') +
        '\n- Physical iPhone, swipe, Diary save, rights and release gate: NOT TESTED.\n\n');
    }
  }
  if (report.status !== 'PASS') process.exitCode = 1;
}
main().catch(err => { console.error(String(err)); process.exitCode = 1; });
