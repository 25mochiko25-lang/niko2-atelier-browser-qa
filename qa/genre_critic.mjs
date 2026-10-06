import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { webkit } = require(process.env.PLAYWRIGHT_MODULE || '/tmp/niko2-browser-qa/node_modules/playwright');

const TARGET = process.env.TARGET || 'https://niko2-atelier-combined-preview.25mochiko25.workers.dev/';
const REQUEST = process.env.REQUEST || 'genre-critic';
const OUTDIR = process.env.OUTDIR || 'qa-output/genre-critic';
const OUT = path.join(OUTDIR, 'observations.json');
fs.mkdirSync(OUTDIR, { recursive: true });

const allowed = (u) => {
  const x = new URL(u);
  return x.protocol === 'https:' && (
    x.hostname === 'niko2atelier.com' ||
    x.hostname.endsWith('.niko2atelier.com') ||
    (x.hostname.endsWith('.workers.dev') && /niko2[-]?atelier/i.test(x.hostname))
  );
};
if (!allowed(TARGET)) throw new Error('Target host is not on the NIKO² ATELIER allowlist: ' + TARGET);

let seq = 0;
const report = {
  request: REQUEST,
  target: TARGET,
  persona: 'genre-savvy harsh but fair visitor',
  engine: 'webkit',
  viewport: { width: 390, height: 844 },
  touch: true,
  startedAt: new Date().toISOString(),
  events: [],
  observations: [],
  pageErrors: [],
  consoleErrors: [],
  requestFailures: [],
};

const sleep = ms => new Promise(r => setTimeout(r, ms));
const compact = (s, n=220) => String(s || '').replace(/\s+/g,' ').trim().slice(0,n);
const safe = s => String(s || 'screen').replace(/[^a-zA-Z0-9_-]+/g,'_').slice(0,90);

async function state(page) {
  return await page.evaluate(() => {
    const vis = e => {
      if (!e) return false;
      const r = e.getBoundingClientRect();
      const s = getComputedStyle(e);
      return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden' &&
        Number(s.opacity || 1) > 0.01 && !e.closest('[hidden]');
    };
    const active = document.querySelector('.view.is-active');
    const actions = [...document.querySelectorAll('button,a,[role="button"],summary,input[type="button"],input[type="submit"]')]
      .filter(vis)
      .map(e => {
        const r = e.getBoundingClientRect();
        return {
          tag: e.tagName,
          id: e.id || '',
          cls: typeof e.className === 'string' ? e.className.slice(0,160) : '',
          text: (e.innerText || e.getAttribute('aria-label') || e.getAttribute('title') || e.value || '').trim().replace(/\s+/g,' ').slice(0,180),
          href: e.getAttribute('href') || '',
          rect: { x:Math.round(r.x), y:Math.round(r.y), w:Math.round(r.width), h:Math.round(r.height) },
          disabled: !!e.disabled || e.getAttribute('aria-disabled') === 'true',
        };
      }).slice(0,120);
    return {
      url: location.href,
      title: document.title,
      hash: location.hash,
      route: active?.dataset?.view || null,
      activeViews: document.querySelectorAll('.view.is-active').length,
      bodyClass: document.body.className,
      scroll: {
        x: Math.round(scrollX), y: Math.round(scrollY),
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight
      },
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 3,
      dialogs: [...document.querySelectorAll('dialog[open],[aria-modal="true"]')].filter(vis).map(e => ({
        id:e.id || '', text:(e.innerText || '').trim().replace(/\s+/g,' ').slice(0,900)
      })),
      bodyText: (document.body.innerText || '').trim().replace(/\s+/g,' ').slice(0,14000),
      actions
    };
  }).catch(e => ({ stateError: String(e) }));
}

async function snap(page, label, note='') {
  const st = await state(page);
  const file = String(++seq).padStart(2,'0') + '-' + safe(label) + '.jpg';
  let screenshotError = null;
  try {
    await page.screenshot({
      path: path.join(OUTDIR, file),
      type: 'jpeg',
      quality: 82,
      fullPage: false,
      timeout: 10000
    });
  } catch (e) {
    screenshotError = String(e);
  }
  report.observations.push({ label, file, note, screenshotError, ...st });
  fs.writeFileSync(OUT, JSON.stringify(report,null,2));
  console.log('SNAP ' + JSON.stringify({label,file,route:st.route,hash:st.hash,scroll:st.scroll,actions:(st.actions||[]).slice(0,12)}));
  return st;
}

async function event(page, label, fn, wait=450) {
  const before = await state(page);
  let error = null;
  let result = null;
  try { result = await fn(); } catch (e) { error = String(e); }
  await sleep(wait);
  const after = await state(page);
  const row = {
    label, result, error,
    before: { url:before.url, route:before.route, hash:before.hash, scroll:before.scroll, dialogs:before.dialogs },
    after: { url:after.url, route:after.route, hash:after.hash, scroll:after.scroll, dialogs:after.dialogs }
  };
  report.events.push(row);
  console.log('EVENT ' + JSON.stringify(row));
  return row;
}

async function visible(page, sel) {
  const l = page.locator(sel).first();
  try { return await l.count() && await l.isVisible(); } catch { return false; }
}

async function firstVisible(page, selectors) {
  for (const sel of selectors) {
    const l = page.locator(sel).first();
    try { if (await l.count() && await l.isVisible()) return l; } catch {}
  }
  return null;
}

async function visibleActionMatching(page, re, exclude=null) {
  const all = page.locator('button,a,[role="button"],summary,input[type="button"],input[type="submit"]');
  const n = await all.count();
  for (let i=0;i<n;i++) {
    const l = all.nth(i);
    try {
      if (!await l.isVisible()) continue;
      if (await l.isDisabled().catch(()=>false)) continue;
      const t = compact((await l.innerText().catch(()=>'')) || (await l.getAttribute('aria-label')) || (await l.getAttribute('title')) || (await l.getAttribute('value')) || '', 240);
      if (!re.test(t)) continue;
      if (exclude && exclude.test(t)) continue;
      return { loc:l, text:t };
    } catch {}
  }
  return null;
}

async function tapMatch(page, label, re, wait=500, exclude=null) {
  const hit = await visibleActionMatching(page,re,exclude);
  if (!hit) {
    report.events.push({label,skipped:true,reason:'no visible matching action'});
    console.log('SKIP '+label);
    return false;
  }
  await event(page,label+' ['+compact(hit.text,100)+']',()=>hit.loc.tap({timeout:6000}),wait);
  return true;
}

async function back(page, label='browser Back') {
  await event(page,label,async()=>{ await page.goBack({waitUntil:'domcontentloaded',timeout:9000}).catch(()=>null); },600);
}

async function forward(page, label='browser Forward') {
  await event(page,label,async()=>{ await page.goForward({waitUntil:'domcontentloaded',timeout:9000}).catch(()=>null); },600);
}

async function returnHome(page, label='return Home') {
  let st = await state(page);
  if (st.route === 'home') return true;
  const ctl = await firstVisible(page,[
    'a[data-route="home"]',
    'button[data-route="home"]',
    '.home-button',
    '.wordmark',
    '[aria-label="Home"]'
  ]);
  if (ctl) {
    await event(page,label+' via visible control',()=>ctl.tap({timeout:6000}),550);
    st = await state(page);
    if (st.route === 'home') return true;
  }
  for(let i=0;i<4;i++){
    await back(page,label+' via Back '+(i+1));
    st = await state(page);
    if(st.route==='home') return true;
  }
  return false;
}

async function openWorld(page) {
  await returnHome(page,'head Home before WORLD');
  await clearPostGardenResponse(page,'advance pending AFTER THE GARDEN before WORLD');
  const direct = await firstVisible(page,['.home-world-lab','[data-route="world"]']);
  if (direct) {
    await event(page,'open WORLD',()=>direct.tap({timeout:6000}),650);
    return true;
  }
  return await tapMatch(page,'open WORLD by text',/WORLD|世界|MAP/i,650,/DIARY/i);
}

async function firstDream(page) {
  const dream = await firstVisible(page,['#enterGarden','button:has-text("Dream")','a:has-text("Dream")']);
  if (!dream) {
    report.events.push({label:'first Dream entry',skipped:true,reason:'entry not visible'});
    return;
  }
  await event(page,'enter first Dream',()=>dream.tap({timeout:6000}),450);

  for(let i=0;i<5;i++){
    const pg = page.locator('#niko2FirstDreamIntro .niko2-intro-page:not([hidden])').first();
    if (!await pg.isVisible().catch(()=>false)) break;
    await snap(page,'first-dream-intro-'+(i+1));

    const concepts = pg.locator('.niko2-intro-concept-button:visible');
    const cn = await concepts.count();
    if (cn) {
      let selected=false;
      for(let j=0;j<cn;j++){
        const cls=await concepts.nth(j).getAttribute('class');
        if(/\bis-selected\b/.test(cls||'')){ selected=true; break; }
      }
      if(!selected){
        const pick=concepts.nth(Math.min(1,cn-1));
        await event(page,'choose one intro interaction concept',()=>pick.tap({timeout:5000}),300);
        await snap(page,'first-dream-interaction-selected');
      }
    }

    const primary = pg.locator('.niko2-intro-primary').first();
    if (!await primary.isVisible().catch(()=>false)) break;
    await event(page,'advance first-dream intro '+(i+1),()=>primary.tap({timeout:5000}),380);
  }

  if (await visible(page,'#beginGarden')) {
    await snap(page,'interaction-before-garden');
    await event(page,'begin Garden',()=>page.locator('#beginGarden').tap({timeout:6000}),600);
  }
  await snap(page,'garden-start');

  for(let i=1;i<=5;i++){
    const target = await firstVisible(page,[
      '.view.is-active .collectible:not(.is-found)',
      '.view.is-active .stage-target:not(.is-found)',
      '.view.is-active [data-collectible]:not(.is-found)'
    ]);
    if(!target) {
      report.events.push({label:'garden discovery '+i,skipped:true,reason:'no visible undiscovered target'});
      break;
    }
    await event(page,'garden discovery '+i,()=>target.tap({timeout:6000}),320);
    if(i===1 || i===3 || i===5) await snap(page,'garden-memory-'+i);
    if(await visible(page,'#closeMemory')) {
      await event(page,'close Garden memory '+i,()=>page.locator('#closeMemory').tap({timeout:5000}),260);
    }
  }

  await sleep(5600);
  await snap(page,'garden-after-five-pause');

  if (await visible(page,'#doorAwake')) {
    await event(page,'open Garden gate',()=>page.locator('#doorAwake').tap({timeout:6000}),900);
    await snap(page,'ending-early');
    await page.waitForFunction(()=>document.querySelector('.quiet-view')?.dataset.endingStage==='artifact',null,{timeout:26000}).catch(()=>{});
    await snap(page,'ending-artifact');

    if(await visible(page,'#quietArtifact')){
      const r = await event(page,'touch ending artifact',()=>page.locator('#quietArtifact').tap({timeout:5000}),400);
      if (r.error && /not stable|TimeoutError/i.test(r.error)) {
        await event(page,'touch ending artifact traversal fallback',()=>page.locator('#quietArtifact').tap({force:true,timeout:3000}),450);
      }
      await snap(page,'ending-artifact-note');
    }
    if(await visible(page,'#bringArtifact')){
      await event(page,'bring artifact back',()=>page.locator('#bringArtifact').tap({timeout:5000}),450);
    } else if(await visible(page,'#leaveQuiet')){
      await event(page,'leave dream',()=>page.locator('#leaveQuiet').tap({timeout:5000}),650);
    }
  }

  if(await visible(page,'#journalDialog')){
    await snap(page,'dream-memory-dialog');
    const carry = await visibleActionMatching(page,/Diaryへ持ち帰る|DIARY.*持ち帰る/i,/保存せず|WITHOUT SAVING/i);
    if(carry){
      await event(page,'carry dream memory to Diary',()=>carry.loc.tap({timeout:5000}),750);
    } else if(await visible(page,'#leaveJournalWithoutSaving')){
      await event(page,'leave journal without saving fallback',()=>page.locator('#leaveJournalWithoutSaving').tap({timeout:5000}),650);
    }
  }

  if(await visible(page,'.niko2-post-garden')){
    for(let i=0;i<4;i++){
      const pg=page.locator('.niko2-post-garden .niko2-intro-page:not([hidden])').first();
      if(!await pg.isVisible().catch(()=>false)) break;
      await snap(page,'post-dream-guide-'+(i+1));
      const pri=pg.locator('.niko2-intro-primary').first();
      if(!await pri.isVisible().catch(()=>false)) break;
      await event(page,'advance post-dream guide '+(i+1),()=>pri.tap({timeout:5000}),400);
    }
  }

  await sleep(500);
  await snap(page,'home-after-first-dream');
}

async function clearPostGardenResponse(page,label='advance AFTER THE GARDEN'){
  for(let i=0;i<6;i++){
    const shell=page.locator('#niko2FirstGardenResponse').first();
    if(!await shell.isVisible().catch(()=>false)) return;
    await snap(page,'after-garden-guide-'+(i+1));
    const next=shell.locator('.niko2-intro-primary:visible').first();
    if(!await next.isVisible().catch(()=>false)) return;
    await event(page,label+' '+(i+1),()=>next.tap({timeout:5000}),450);
  }
}

async function exploreDiary(page){
  await returnHome(page,'return Home for Diary');
  await clearPostGardenResponse(page,'advance pending AFTER THE GARDEN before Diary');
  if(!await visible(page,'.home-diary-entry')){
    await snap(page,'home-no-diary-entry');
    return;
  }
  await event(page,'open Diary',()=>page.locator('.home-diary-entry').tap({timeout:6000}),650);
  await snap(page,'diary-top');
  await event(page,'scroll Diary midway',()=>page.evaluate(()=>scrollTo({top:Math.min(document.body.scrollHeight*0.45,1100),behavior:'instant'})),350);
  await snap(page,'diary-mid');
  const detail=await visibleActionMatching(page,/OPEN|READ|読む|見る|DETAIL|MEMORY|記録/i,/HOME|BACK/i);
  if(detail){
    await event(page,'open one Diary detail ['+compact(detail.text,90)+']',()=>detail.loc.tap({timeout:5000}),500);
    await snap(page,'diary-detail');
  }
}

async function exploreLab(page){
  await openWorld(page);
  await snap(page,'world-first-look');
  const portal=await firstVisible(page,['.world-portal-lab']);
  if(portal){
    await event(page,'enter Research Lab',()=>portal.tap({timeout:6000}),650);
  }else if(!await tapMatch(page,'enter Research Lab by text',/RESEARCH\s*LAB|LAB|研究/i,650)){
    return;
  }
  await snap(page,'lab-entry');
  if(await visible(page,'#beginLab')){
    await event(page,'begin Lab',()=>page.locator('#beginLab').tap({timeout:6000}),650);
    await snap(page,'lab-main');
  }
  if(await visible(page,'#openReadingTable')){
    await event(page,'open Lab reading table',()=>page.locator('#openReadingTable').tap({timeout:6000}),520);
    await snap(page,'lab-reading-table');
    const rec=page.locator('#readingTableRecords button:visible').first();
    if(await rec.isVisible().catch(()=>false)){
      await event(page,'open first Lab record',()=>rec.tap({timeout:5000}),550);
      await snap(page,'lab-first-record');
    }
    if(await visible(page,'#closeDossier')) await event(page,'close Lab dossier',()=>page.locator('#closeDossier').tap({timeout:5000}),250);
    if(await visible(page,'#closeReadingTable')) await event(page,'close reading table',()=>page.locator('#closeReadingTable').tap({timeout:5000}),250);
  }
}

async function explorePortal(page, key, regex, selectors=[]){
  await openWorld(page);
  await snap(page,'world-before-'+key);
  let portal = await firstVisible(page,selectors);
  if(portal){
    await event(page,'enter '+key,()=>portal.tap({timeout:6000}),650);
  }else if(!await tapMatch(page,'enter '+key+' by text',regex,650)){
    await snap(page,key+'-not-available');
    return false;
  }
  await snap(page,key+'-entry');
  await event(page,'scroll '+key+' a little',()=>page.evaluate(()=>scrollBy({top:Math.min(720,innerHeight*0.82),behavior:'instant'})),320);
  await snap(page,key+'-lower');
  return true;
}

async function exploreHomeLetter(page){
  await returnHome(page,'return Home for letter');
  await event(page,'scroll Home middle',()=>page.evaluate(()=>scrollTo({top:document.body.scrollHeight*0.38,behavior:'instant'})),300);
  await snap(page,'home-middle');
  if(await visible(page,'.home-letter-entry')){
    await event(page,'open From the Atelier letter',()=>page.locator('.home-letter-entry').tap({timeout:6000}),600);
    await snap(page,'from-the-atelier');
  }
}

(async()=>{
  const browser=await webkit.launch({headless:true});
  const context=await browser.newContext({
    viewport:{width:390,height:844},
    screen:{width:390,height:844},
    isMobile:true,hasTouch:true,deviceScaleFactor:3,
    locale:'ja-JP',timezoneId:'Asia/Tokyo',
    userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1'
  });
  const page=await context.newPage();

  page.on('pageerror',e=>report.pageErrors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error') report.consoleErrors.push(m.text());});
  page.on('requestfailed',r=>report.requestFailures.push({url:r.url(),error:r.failure()?.errorText||'failed'}));

  try{
    const res=await page.goto(TARGET,{waitUntil:'domcontentloaded',timeout:25000});
    report.httpStatus=res?.status() ?? null;
    await page.waitForFunction(()=>!!document.querySelector('.view.is-active'),null,{timeout:10000}).catch(()=>{});
    await sleep(1200);
    await snap(page,'fresh-first-impression');

    await firstDream(page);
    await returnHome(page,'return Home after first Dream');
    await clearPostGardenResponse(page);
    await snap(page,'home-after-post-garden-guide');
    await exploreHomeLetter(page);
    await exploreDiary(page);
    await exploreLab(page);

    await explorePortal(page,'perfume',/PERFUME|FRAGRANCE|香水/i,['.world-portal-perfume']);
    const perfumeState=await state(page);
    if(perfumeState.route && !['world','home'].includes(perfumeState.route)){
      const ctrl=await visibleActionMatching(page,/MIX|調合|NOTE|素材|BOTTLE|瓶|CREATE|作る/i,/HOME|BACK/i);
      if(ctrl){
        await event(page,'touch one Perfume control ['+compact(ctrl.text,90)+']',()=>ctrl.loc.tap({timeout:5000}),480);
        await snap(page,'perfume-one-interaction');
      }
    }

    await explorePortal(page,'hotel',/HOTEL|SOMNIA/i,['.world-portal-hotel']);
    await explorePortal(page,'aquarium',/AQUARIUM|水族|水槽/i,['.world-portal-aquarium']);
    await explorePortal(page,'cabinet',/CABINET|棚|キャビネット/i,['.world-portal-cabinet']);

    await returnHome(page,'return Home for revisit');
    await snap(page,'home-before-late-revisit');
    if(await visible(page,'#enterGarden')){
      await event(page,'revisit Dream late',()=>page.locator('#enterGarden').tap({timeout:6000}),600);
      await snap(page,'late-dream-revisit');
      await back(page,'Back out after late revisit');
      await forward(page,'Forward after changing mind');
      await snap(page,'after-back-forward-late-revisit');
    }

    await returnHome(page,'final Home return');
    await event(page,'final Home reload',()=>page.reload({waitUntil:'domcontentloaded',timeout:15000}),800);
    await snap(page,'final-home-after-reload');

    report.final = await state(page);
  }catch(e){
    report.fatal=String(e?.stack||e);
  }finally{
    report.finishedAt=new Date().toISOString();
    fs.writeFileSync(OUT,JSON.stringify(report,null,2));
    console.log('FINAL '+JSON.stringify({
      status:report.httpStatus,
      observations:report.observations.length,
      events:report.events.length,
      pageErrors:report.pageErrors.length,
      consoleErrors:report.consoleErrors.length,
      requestFailures:report.requestFailures.length,
      fatal:report.fatal||null,
      finalRoute:report.final?.route||null
    }));
    await context.close().catch(()=>{});
    await browser.close().catch(()=>{});
  }
})().catch(e=>{
  report.fatal=String(e?.stack||e);
  report.finishedAt=new Date().toISOString();
  fs.writeFileSync(OUT,JSON.stringify(report,null,2));
  console.error(e?.stack||e);
  process.exitCode=1;
});
