import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {webkit}=require('/tmp/niko2-browser-qa/node_modules/playwright');
const cfg=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const target=cfg.target;
if(!['niko2atelier.com','niko2-atelier-combined-preview.25mochiko25.workers.dev'].includes(new URL(target).hostname))throw Error('Target not permitted');
const out='qa-output/outside-followthrough';fs.mkdirSync(out,{recursive:true});
const report={target,method:'Fresh browser; ordinary UI replay followed by deliberately chosen follow-up actions. Not autonomous human behavior.',viewport:{width:390,height:844},engine:'WebKit',startedAt:new Date().toISOString(),events:[],observations:[],errors:[],limits:[]};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let seq=0;
const browser=await webkit.launch({headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,locale:'ja-JP',timezoneId:'Asia/Tokyo',deviceScaleFactor:1});
const p=await context.newPage();p.setDefaultTimeout(5000);
p.on('pageerror',e=>report.errors.push(String(e)));
const seen=async s=>p.locator(s).first().isVisible().catch(()=>false);
const route=async()=>p.locator('.view.is-active').getAttribute('data-view').catch(()=>null);
async function snapshot(label,image=false){
 const st=await p.evaluate(()=>{
  const vis=e=>{if(!e)return false;const r=e.getBoundingClientRect(),c=getComputedStyle(e);return r.width>1&&r.height>1&&c.display!=='none'&&c.visibility!=='hidden'&&Number(c.opacity)>0.01&&!e.closest('[hidden],[inert]');};
  const overlays=[...document.querySelectorAll('dialog[open],#niko2FirstDreamIntro,#niko2FirstGardenResponse,.niko2-post-garden')].filter(vis);
  const root=overlays.at(-1)||document.querySelector('.view.is-active')||document.body;
  return{url:location.href,route:document.querySelector('.view.is-active')?.dataset.view||null,text:(root.innerText||'').trim().slice(0,15000),actions:[...root.querySelectorAll('button,a,summary,input[type=submit]')].filter(vis).map(e=>{const r=e.getBoundingClientRect();return{id:e.id,text:(e.innerText||e.getAttribute('aria-label')||e.getAttribute('title')||'').trim().slice(0,180),href:e.getAttribute('href'),disabled:!!e.disabled,rect:{x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)}};}).slice(0,100),images:[...root.querySelectorAll('img')].filter(vis).map(e=>({alt:e.alt,loaded:e.complete&&e.naturalWidth>0})).slice(0,12)};
 });
 let file=null;
 if(image){file=String(++seq).padStart(2,'0')+'-'+label.replace(/[^a-zA-Z0-9_-]/g,'_')+'.jpg';await p.screenshot({path:path.join(out,file),type:'jpeg',quality:66,timeout:8000}).catch(e=>{report.limits.push({label,screenshot:String(e)});file=null;});}
 report.observations.push({label,file,...st});
 fs.writeFileSync(path.join(out,'observations.json'),JSON.stringify(report,null,2));
 console.log('OBS '+JSON.stringify({label,route:st.route,text:st.text.slice(0,180)}));return st;
}
async function act(label,fn,delay=650){
 const before=await route();let error=null;
 try{await fn();}catch(e){error=String(e);report.limits.push({label,error});}
 await sleep(delay);const after=await route();report.events.push({label,before,after,error});console.log('ACT '+JSON.stringify({label,before,after,error:error?.slice(0,150)}));return !error;
}
async function tap(sel,label,delay=650){
 return act(label,async()=>{const el=p.locator(sel).first();await el.scrollIntoViewIfNeeded();await el.tap();},delay);
}
async function named(text,label=text,delay=650){
 return act(label,async()=>{const el=p.getByRole('button',{name:text,exact:true}).first();await el.scrollIntoViewIfNeeded();await el.tap();},delay);
}
async function guides(){
 for(let i=0;i<8;i++){
  const shell=p.locator('#niko2FirstDreamIntro:visible,#niko2FirstGardenResponse:visible,.niko2-post-garden:visible').last();
  if(!await shell.count())return;
  const concepts=shell.locator('.niko2-intro-concept-button:visible');
  if(await concepts.count()&&!await shell.locator('.niko2-intro-concept-button.is-selected:visible').count()){
   await act('select introductory interaction concept',()=>concepts.first().tap(),350);
  }
  const next=shell.locator('.niko2-intro-primary:visible').first();
  await snapshot('guide-'+report.observations.length);
  if(!await next.count())return;
  if(!await act('advance visible guide: '+await next.innerText(),()=>next.tap(),750))return;
 }
}
async function home(label){
 if(await route()==='home'){await guides();return true;}
 const homeLink=p.locator('a[data-route="home"]:visible,button[data-route="home"]:visible').first();
 if(await homeLink.count())await act(label||'return Home by visible link',()=>homeLink.tap(),650);
 else await act(label||'browser Back to Home',()=>p.goBack({waitUntil:'domcontentloaded',timeout:8000}),650);
 await guides();return await route()==='home';
}
async function garden(){
 if(await route()!=='garden')return;
 await p.locator('#beginGarden').waitFor({state:'visible',timeout:7000}).catch(()=>{});
 if(await seen('#beginGarden'))await tap('#beginGarden','enter the Garden scene',1400);
 await snapshot('garden-open',true);
 for(let i=0;i<5;i++){
  const obj=p.locator('.view.is-active .collectible:not(.is-found):visible,.view.is-active .stage-target:not(.is-found):visible').first();
  await obj.waitFor({state:'visible',timeout:7000}).catch(()=>{});
  if(!await obj.count()||!await obj.isVisible().catch(()=>false)){report.limits.push({label:'Garden acquisition',reason:'No visible undiscovered object found by driver'});break;}
  const label=await obj.getAttribute('aria-label')||'object';
  if(!await act('touch '+label,()=>obj.tap(),600))break;
  await snapshot('garden-memory-'+(i+1),i===0||i===4);
  if(await seen('#closeMemory'))await tap('#closeMemory','close memory card',600);
 }
 await p.locator('#doorAwake').waitFor({state:'visible',timeout:14000}).catch(()=>{});
 if(!await seen('#doorAwake')){report.limits.push({label:'Garden ending',reason:'Gate did not become available in bounded wait'});return;}
 await snapshot('garden-gate',true);await tap('#doorAwake','open the Garden gate',1300);
 await p.waitForFunction(()=>document.querySelector('.quiet-view')?.dataset.endingStage==='artifact',null,{timeout:26000}).catch(()=>{});
 await snapshot('garden-ending',true);
 if(await seen('#quietArtifact')){
  await act('touch floating souvenir at its on-screen centre',async()=>{const r=await p.locator('#quietArtifact').boundingBox();if(!r)throw Error('Souvenir not onscreen');await p.touchscreen.tap(r.x+r.width/2,r.y+r.height/2);},700);
  await snapshot('garden-souvenir-note',true);
 }
 if(await seen('#bringArtifact'))await tap('#bringArtifact','bring souvenir back',800);
 else if(await seen('#leaveQuiet'))await tap('#leaveQuiet','leave the dream',800);
 if(await seen('#journalDialog')){
  await snapshot('garden-carry-dialog',true);
  await tap('#journalDialog button[type="submit"]','carry dream memory to Diary',1000);
 }
 await guides();await snapshot('after-Garden');
}
async function perfume(){
 if(await route()!=='perfume')return false;
 await snapshot('perfume-entrance',true);
 if(await seen('#enterPerfumeWorkbench'))await tap('#enterPerfumeWorkbench','open the perfume workbench',900);
 await snapshot('perfume-before-mixing',true);
 for(const [layer,material] of [['01 TOP','甘い夢'],['02 MIDDLE','紅茶の渋み'],['03 LAST','煙の名残']]){
  if(!await named(layer,'choose layer '+layer,350))return false;
  if(!await named(material,'put '+material+' in '+layer,550))return false;
 }
 await snapshot('perfume-three-layers',true);
 if(!await named('香りを定着させる','finish one perfume',1300))return false;
 await p.locator('#perfumeResult').waitFor({state:'visible',timeout:15000}).catch(()=>{});
 await sleep(2400);await snapshot('perfume-result',true);
 if(await seen('#savePerfumeArtifact')){
  await tap('#savePerfumeArtifact','carry finished perfume to Diary',900);await snapshot('perfume-diary',true);
  const recent=p.locator('.diary-recent-piece:visible,.diary-entry:visible').first();
  if(await recent.count()){await act('open the most recent saved object',()=>recent.tap(),700);await snapshot('perfume-saved-detail',true);}
  if(await seen('#closeDiaryEntryDetail'))await tap('#closeDiaryEntryDetail','close saved perfume detail');
 }
 return true;
}
async function lab(){
 if(!await home())return;
 if(!await seen('.home-world-lab'))return;
 await tap('.home-world-lab','open WORLD',1000);await snapshot('world',true);
 if(!await seen('.world-portal-lab'))return;
 await tap('.world-portal-lab','enter Research Lab',800);
 if(await seen('#beginLab'))await tap('#beginLab','enter the observation room',900);
 await snapshot('lab-room',true);
 if(!await seen('#openReadingTable'))return;
 await tap('#openReadingTable','look at records on the table',500);await snapshot('lab-record-menu',true);
 const records=p.locator('#readingTableRecords button:visible');
 if(await records.count()){
  const wanted=records.filter({hasText:/マシュマロ|消失|扉/}).first();const chosen=await wanted.count()?wanted:records.first();
  await act('read the record: '+(await chosen.innerText()).slice(0,100),()=>chosen.tap(),600);
  await snapshot('lab-record-read',true);
  if(await seen('#closeDossier'))await tap('#closeDossier','close record');
 }
 if(await seen('#closeReadingTable'))await tap('#closeReadingTable','close reading table');
 if(await seen('#enterInnerRoom')){
  await tap('#enterInnerRoom','follow the glass passage to the archive',800);await snapshot('lab-inner-room',true);
  const incident=p.locator('.lab-archive-hotspots button:visible').filter({hasText:/M-00-14/}).first();
  if(await incident.count()){
   await act('read the small returned packet in the archive',()=>incident.tap(),600);await snapshot('lab-archive-record',true);
   if(await seen('#closeDossier'))await tap('#closeDossier','close archive record');
  }
 }
 if(await seen('#labBack'))await tap('#labBack','leave archive or Lab',500);
 if(await route()==='lab'&&await seen('#labBack'))await tap('#labBack','leave Lab',650);
}
async function unknown(){
 if(!await home())return;
 if(!await seen('.unknown-entry'))return;
 await tap('.unknown-entry','follow the ??? entrance',900);await snapshot('unknown-room',true);
 const root=p.locator('.view.is-active');
 const interesting=root.locator('button:visible').filter({hasText:/入る|進む|覗く|開く|見る/}).first();
 if(await interesting.count()){
  await act('try the offered action: '+(await interesting.innerText()).slice(0,80),()=>interesting.tap(),900);await snapshot('unknown-response',true);
 }
}
try{
 const res=await p.goto(target,{waitUntil:'domcontentloaded',timeout:25000});report.httpStatus=res?.status();await sleep(1400);
 await snapshot('arrival',true);await guides();
 if(await route()==='home'&&await seen('#enterGarden')){await tap('#enterGarden','enter the first dream',1200);await guides();}
 await garden();
 await home('return Home after the Garden');await snapshot('home-after-first-dream',true);
 let gotPerfume=false;
 for(let attempt=0;attempt<3&&!gotPerfume;attempt++){
  if(!await home())break;
  if(!await seen('#enterGarden'))break;
  await tap('#enterGarden','open another dream from Home',1400);await snapshot('next-dream-'+(attempt+1),true);
  if(await route()==='perfume'){gotPerfume=await perfume();break;}
  if(await route()==='hotel'){
   if(await seen('#hotelCheckIn'))await tap('#hotelCheckIn','check into the offered hotel room',1000);
   await snapshot('hotel-service-menu',true);
   const service=p.locator('#hotelMenu button:visible:not([disabled])').first();
   if(await service.count()){await act('order the first offered room service: '+(await service.innerText()).slice(0,80),()=>service.tap(),10000);await snapshot('hotel-delivery',true);}
   if(await seen('#hotelCheckout')){await tap('#hotelCheckout','check out after room service',900);await snapshot('hotel-checkout',true);}
  }
 }
 if(!gotPerfume)report.limits.push({label:'Perfume continuation',reason:'A finished perfume was not reached by the bounded public UI path'});
 await lab();await unknown();
 await snapshot('last-state');report.finishedAt=new Date().toISOString();
}catch(e){report.fatal=String(e.stack||e);await snapshot('unexpected-stop',true).catch(()=>{});}
finally{
 fs.writeFileSync(path.join(out,'observations.json'),JSON.stringify(report,null,2));
 const sections=['# Outside critic followthrough evidence','Target: '+target,'Method: '+report.method,'',...report.events.map((e,i)=>`${i+1}. ${e.label} | ${e.before} -> ${e.after} | ${e.error||'OK'}`),'','## Observed content',...report.observations.flatMap(s=>['','### '+s.label+' / '+s.route,s.text,'','Actions: '+s.actions.map(a=>a.text+(a.disabled?' [disabled]':'')).join(' | ')]),'','## Limits',JSON.stringify(report.limits,null,2),'## Page errors',JSON.stringify(report.errors,null,2)];
 fs.writeFileSync(path.join(out,'evidence.md'),sections.join('\n'));
 await context.close();await browser.close();console.log('FINISHED '+JSON.stringify({events:report.events.length,observations:report.observations.length,errors:report.errors.length,limits:report.limits.length,fatal:report.fatal||null}));
}
