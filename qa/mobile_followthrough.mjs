import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {webkit}=require('/tmp/niko2-browser-qa/node_modules/playwright');
const cfg=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const target=cfg.target;
if(new URL(target).origin!=='https://niko2-atelier-combined-preview.25mochiko25.workers.dev')throw Error('Unexpected target');
const out='qa-output/mobile-follow';fs.mkdirSync(out,{recursive:true});
const report={target,persona:'sloppy-mobile',method:'Additional fresh WebKit session. Replay visible entry controls, then follow through mixing/saving/interiors. No product source access, storage seeding, hash jumps or internal function calls. Programmatic scroll, not physical inertia.',startedAt:new Date().toISOString(),engine:'WebKit',viewport:[390,844],events:[],observations:[],limits:[],pageErrors:[],httpErrors:[]};
const b=await webkit.launch({headless:true});
const c=await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,deviceScaleFactor:1,locale:'ja-JP',timezoneId:'Asia/Tokyo'});
const p=await c.newPage();p.setDefaultTimeout(4000);p.setDefaultNavigationTimeout(18000);
p.on('pageerror',e=>report.pageErrors.push(String(e)));
p.on('response',r=>{if(r.status()>=400){const u=new URL(r.url());report.httpErrors.push({path:u.origin+u.pathname,status:r.status()});}});
const pause=ms=>p.waitForTimeout(ms);
const route=()=>p.locator('.view.is-active').getAttribute('data-view').catch(()=>null);
const seen=sel=>p.locator(sel).first().isVisible().catch(()=>false);
let imageNo=0,actions=0;const deadline=Date.now()+240000;
function flush(){fs.writeFileSync(path.join(out,'observations.json'),JSON.stringify(report,null,2));}
async function snap(label,image=false){
 const s=await p.evaluate(()=>{
  function vis(e){if(!e||e.closest('[hidden],[inert]'))return false;const r=e.getBoundingClientRect();if(r.width<1||r.height<1)return false;for(let n=e;n&&n.nodeType===1;n=n.parentElement){const q=getComputedStyle(n);if(q.display==='none'||q.visibility==='hidden'||Number(q.opacity)===0)return false;}return true;}
  const overlays=[...document.querySelectorAll('dialog[open],#niko2FirstDreamIntro,#niko2FirstGardenResponse,.niko2-post-garden')].filter(vis);
  const root=overlays.at(-1)||document.querySelector('.view.is-active')||document.body;
  const controls=[...root.querySelectorAll('button,a,summary,input,textarea')].filter(vis).map(e=>{const r=e.getBoundingClientRect(),x=Math.max(0,Math.min(innerWidth-1,r.x+r.width/2)),y=Math.max(0,Math.min(innerHeight-1,r.y+r.height/2)),hit=document.elementFromPoint(x,y);return{id:e.id,text:(e.innerText||e.getAttribute('aria-label')||e.getAttribute('title')||e.getAttribute('placeholder')||'').trim().replace(/\s+/g,' ').slice(0,130),tag:e.tagName,disabled:!!e.disabled,rect:[Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)],onscreen:r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth,hit:!!hit&&(hit===e||e.contains(hit)),href:e.getAttribute('href')};}).slice(0,100);
  return{url:location.origin+location.pathname+location.hash,route:document.querySelector('.view.is-active')?.dataset.view,activeViews:document.querySelectorAll('.view.is-active').length,text:(root.innerText||'').trim().replace(/\s+/g,' ').slice(0,6500),controls,overlays:overlays.map(e=>e.id||e.className),scroll:[scrollX,scrollY,document.documentElement.scrollWidth,document.documentElement.scrollHeight],overflow:document.documentElement.scrollWidth>innerWidth+2,scrollers:[...root.querySelectorAll('*')].filter(e=>vis(e)&&e.scrollHeight>e.clientHeight+20&&/auto|scroll/.test(getComputedStyle(e).overflowY)).slice(0,8).map(e=>({id:e.id,cls:String(e.className).slice(0,80),top:e.scrollTop,height:e.clientHeight,content:e.scrollHeight})),images:[...root.querySelectorAll('img')].filter(vis).slice(0,12).map(e=>({alt:e.alt,loaded:e.complete&&e.naturalWidth>0}))};
 }).catch(e=>({error:String(e)}));
 const row={label,at:new Date().toISOString(),...s};
 if(image&&imageNo<18){row.image=String(++imageNo).padStart(2,'0')+'-'+label.replace(/[^a-zA-Z0-9_-]/g,'_')+'.jpg';await p.screenshot({path:path.join(out,row.image),type:'jpeg',quality:66,timeout:7000}).catch(e=>{row.imageError=String(e);});}
 report.observations.push(row);flush();console.log('OBS '+JSON.stringify({label,route:s.route,text:s.text?.slice(0,110),image:row.image}));return row;
}
async function act(label,fn,delay=450,image=false){if(Date.now()>deadline||actions>=140)throw Error('Bounded visitor session budget reached');actions++;const before=await snap(label+':before');let error=null;const start=Date.now();try{await fn();}catch(e){error=String(e);report.limits.push({label,error});}await pause(delay);const after=await snap(label+':after',image);report.events.push({label,before:before.label,after:after.label,beforeRoute:before.route,afterRoute:after.route,elapsed:Date.now()-start,error});flush();return !error;}
async function first(selectors){for(const sel of selectors){const loc=p.locator(sel);for(let i=0;i<Math.min(await loc.count(),15);i++){const e=loc.nth(i);if(await e.isVisible().catch(()=>false)&&await e.isEnabled().catch(()=>true))return e;}}return null;}
async function tap(sel,label,delay=450,image=false){const l=await first([sel]);if(!l){report.limits.push({label,reason:'No visible enabled target'});return false;}return act(label,()=>l.tap(),delay,image);}
async function name(text,label=text,delay=450){const l=p.getByRole('button',{name:text,exact:true}).first();if(!await l.isVisible().catch(()=>false)){report.limits.push({label,reason:'Named button not available'});return false;}return act(label,()=>l.tap(),delay);}
async function double(sel,label,gap=160){const l=await first([sel]);if(!l){report.limits.push({label,reason:'No visible target for second-tap test'});return false;}await l.scrollIntoViewIfNeeded();return act(label,async()=>{const r=await l.boundingBox();if(!r)throw Error('No bounding box');const x=Math.min(388,Math.max(1,r.x+r.width/2)),y=Math.min(842,Math.max(1,r.y+r.height/2));const hits=[];for(let i=0;i<2;i++){hits.push(await p.evaluate(({x,y})=>{const e=document.elementFromPoint(x,y)?.closest('button,a,[role=button]');return e?{id:e.id,text:(e.innerText||e.getAttribute('aria-label')||'').slice(0,90)}:null;},{x,y}));await p.touchscreen.tap(x,y);if(i===0)await pause(gap);}report.events.push({label:label+':input-hits',kind:'two physical-coordinate taps',gapMs:gap,x,y,hits});},700);}
async function scroll(label,amount=620){return act(label,()=>p.evaluate(amount=>{let el=document.elementFromPoint(innerWidth/2,innerHeight*0.62);while(el&&el!==document.body){const s=getComputedStyle(el);if(el.scrollHeight>el.clientHeight+15&&/auto|scroll/.test(s.overflowY)){el.scrollBy({top:amount,behavior:'auto'});return;}el=el.parentElement;}window.scrollBy({top:amount,behavior:'auto'});},amount),120);}
async function guides(){for(let i=0;i<8;i++){const l=await first(['#niko2FirstDreamIntro .niko2-intro-primary','#niko2FirstGardenResponse .niko2-intro-primary','.niko2-post-garden .niko2-intro-primary']);if(!l)return;const choices=p.locator('.niko2-intro-concept-button:visible');if(await choices.count()&&!await p.locator('.niko2-intro-concept-button.is-selected:visible').count())await act('guide: choose one shown concept',()=>choices.first().tap(),180);if(!await act('guide: '+await l.innerText(),()=>l.tap(),450))return;}}
async function closeOverlay(){const close=await first(['dialog[open] button[aria-label*="閉"]','#closeDiaryEntryDetail','#closeDossier','#closeReadingTable','dialog[open] button.close']);if(close)await act('close visible detail',()=>close.tap(),250);}
async function home(){await closeOverlay();if(await route()==='home'){await guides();return true;}for(let i=0;i<2;i++){const back=await first(['a[data-route="home"]:visible','button[data-route="home"]:visible','a[href="#home"]:visible','#perfumeBack','#labBack']);if(!back)break;await act('return using visible control: '+((await back.innerText())||(await back.getAttribute('aria-label'))||await back.getAttribute('id')),()=>back.tap(),700);if(await route()==='home'){await guides();return true;}}report.limits.push({label:'Home return',reason:'Visible return path did not reach Home in two actions'});return false;}
async function skipGarden(){if(await route()!=='garden'&&await route()!=='quiet')return;for(let i=0;i<2;i++){if(await seen('#gardenSkipControl'))await tap('#gardenSkipControl','replay known Garden exit '+(i+1),850);else break;}await guides();}
async function runPart(label,fn){try{await fn();}catch(e){report.limits.push({label,error:String(e)});await snap(label+'-stopped',true).catch(()=>{});}flush();}
const reached={};let perfumeName='';
async function perfume(){
 reached.perfume=true;await snap('perfume-entrance',true);if(await seen('#enterPerfumeWorkbench'))await tap('#enterPerfumeWorkbench','open perfume workbench',500);
 if(!await name('01 TOP','select TOP',170))return;
 const rain=p.getByRole('button',{name:'雨',exact:true});if(await rain.count())await double('button.perfume-material:has-text("雨")','two impatient taps on rain');
 if(!await name('02 MIDDLE','change to MIDDLE quickly',150))return;
 if(!await name('古いぬいぐるみ','choose old plush',150))return;
 if(!await name('03 LAST','change to LAST quickly',150))return;
 if(!await name('燃えた砂糖','choose burnt sugar',250))return;
 await snap('perfume-three-layers',true);await scroll('scroll workbench down');
 if(!await double('#composePerfume','compose, then tap once more'))return;
 await p.locator('#perfumeResult').waitFor({state:'visible',timeout:18000}).catch(()=>{});await pause(2000);
 const s=await snap('perfume-result',true);perfumeName=(s.text||'').slice(0,500);
 if(await seen('#savePerfumeArtifact'))await double('#savePerfumeArtifact','save perfume, then tap once more');
 await snap('diary-after-save',true);if(await route()!=='diary'){report.limits.push({label:'Perfume saving',reason:'Did not reach Diary'});return;}
 reached.diary=true;const entry=await first(['.diary-recent-piece','.diary-entry']);if(entry)await act('open saved diary object',()=>entry.tap(),500,true);await closeOverlay();
 await act('browser Back after perfume save',()=>p.goBack({waitUntil:'domcontentloaded',timeout:8000}),500);
 await act('browser Forward after perfume save',()=>p.goForward({waitUntil:'domcontentloaded',timeout:8000}),500);
 await snap('after-saved-back-forward',true);
 await act('reload after saving',()=>p.reload({waitUntil:'domcontentloaded'}),900);
 await guides();if(await route()!=='diary')await tap('.home-diary-entry, a[data-route="diary"], button[data-route="diary"]','reopen Diary after reload',650);
 await snap('diary-after-reload-reentry',true);
 if(await route()==='diary'){await scroll('scroll Diary downward',950);await snap('diary-scrolled');const cabinet=await first(['#openCabinetThreshold']);if(cabinet){await act('open Cabinet threshold',()=>cabinet.tap(),300);await tap('#enterCabinet','enter Cabinet',700);reached.cabinet=(await route()==='cabinet');await snap('cabinet-arrival',true);await act('browser Back from Cabinet',()=>p.goBack({waitUntil:'domcontentloaded',timeout:8000}),350);await act('browser Forward back to Cabinet',()=>p.goForward({waitUntil:'domcontentloaded',timeout:8000}),450);await snap('cabinet-returned');}}
}
async function hotel(){
 reached.hotel=true;await snap('hotel-arrival',true);
 if(!await seen('#hotelCheckIn')){report.limits.push({label:'Hotel check-in',reason:'No offered check-in in this visitor state'});return;}
 await tap('#hotelCheckIn','check into Hotel',600);await snap('hotel-menu');
 const service=await first(['#hotelMenu button:not([disabled])']);if(service){await act('order first offered service: '+(await service.innerText()).slice(0,90),()=>service.tap(),180);await snap('hotel-early-delivery');await pause(9500);await snap('hotel-delivered',true);}
 if(await seen('#hotelSaveNight')){await tap('#hotelSaveNight','save Hotel night to Diary',650);await snap('hotel-saved');if(await seen('#returnToDream'))await tap('#returnToDream','return to Hotel from saved night',650);}
 if(await seen('#hotelServiceOpen'))await tap('#hotelServiceOpen','open Hotel service controls',250);
 if(await seen('#hotelCheckout'))await double('#hotelCheckout','check out, then tap once more');
 await snap('hotel-after-checkout',true);
}
async function lab(){
 if(!await home())return;if(!await tap('.home-world-lab','open WORLD',650))return;await snap('world-arrival');
 if(!await tap('.world-portal-lab','follow Research Lab entrance',500))return;
 if(await seen('#beginLab'))await tap('#beginLab','enter Research Lab',650);
 reached.lab=(await route()==='lab');await snap('lab-arrival',true);
 if(await seen('#openReadingTable')){await tap('#openReadingTable','open Lab reading table',250);await scroll('scroll reading table quickly',700);await snap('lab-reading-table');const record=await first(['#readingTableRecords button']);if(record)await act('read a visible Lab record: '+(await record.innerText()).slice(0,80),()=>record.tap(),350,true);await tap('#closeDossier','close record quickly',180);if(await seen('#closeReadingTable'))await tap('#closeReadingTable','close reading table',180);}
 if(await seen('#enterInnerRoom')){await tap('#enterInnerRoom','follow passage deeper into Lab',450);await snap('lab-inner-room',true);const r=await first(['.lab-archive-hotspots button']);if(r)await act('touch archive object: '+((await r.getAttribute('aria-label'))||await r.innerText()).slice(0,70),()=>r.tap(),250);if(await seen('#closeDossier'))await tap('#closeDossier','close archive record',180);}
 await act('browser Back from Lab interior',()=>p.goBack({waitUntil:'domcontentloaded',timeout:8000}),350);await act('browser Forward to Lab interior',()=>p.goForward({waitUntil:'domcontentloaded',timeout:8000}),350);await snap('lab-after-history');await home();
}
async function unknown(){if(!await home())return;if(!await tap('.unknown-entry','follow ??? entrance',600))return;reached.unknown=true;await snap('unknown-arrival',true);const button=await first(['.view.is-active button:not([disabled]):not([data-route]):not(#soundToggle)']);if(button){await act('try first offered room control: '+((await button.innerText())||(await button.getAttribute('aria-label'))||await button.getAttribute('id')),()=>button.tap(),450);await snap('unknown-response');}await home();}
try{
 const response=await p.goto(target,{waitUntil:'domcontentloaded'});report.httpStatus=response?.status();await pause(900);await snap('arrival');
 await tap('#enterGarden','replay public entry',450);await guides();await skipGarden();
 for(let n=0;n<5&&!reached.perfume;n++){if(!await home())break;if(!await tap('#enterGarden','enter another offered dream '+(n+1),1000))break;await snap('offered-dream-'+n);const r=await route();if(r==='perfume')await runPart('perfume',perfume);else if(r==='hotel'&&!reached.hotel)await runPart('hotel',hotel);else if(r==='garden'||r==='quiet')await skipGarden();else await home();}
 await runPart('lab',lab);await runPart('unknown',unknown);
 for(let n=0;n<4&&!reached.hotel;n++){if(!await home())break;if(!await tap('#enterGarden','another dream while exploring '+(n+1),900))break;const r=await route();await snap('later-dream-'+n);if(r==='hotel')await runPart('hotel',hotel);else if(r==='garden'||r==='quiet')await skipGarden();else await home();}
 await snap('final');
}catch(e){report.fatal=String(e.stack||e);await snap('fatal-state',true).catch(()=>{});}
finally{report.reached=reached;report.finishedAt=new Date().toISOString();flush();const lines=['# Mobile visitor followthrough evidence','Target: '+target,'Method: '+report.method,'Started: '+report.startedAt,'Finished: '+report.finishedAt,'',...report.events.map((e,i)=>`${i+1}. ${e.label} | ${e.beforeRoute||''} -> ${e.afterRoute||''} | ${e.error||'OK'}`),'','## Snapshots',...report.observations.flatMap(s=>['','### '+s.label+' / '+s.route,s.text||'', 'OVERLAYS: '+JSON.stringify(s.overlays||[]),'VISIBLE CONTROLS: '+(s.controls||[]).filter(x=>x.onscreen).map(x=>x.id+':'+x.text+(x.disabled?' [disabled]':'')+(!x.hit?' [covered]':'')).join(' | ')]),'','## Reached',JSON.stringify(reached),'## Limits',JSON.stringify(report.limits,null,2),'## Page errors',JSON.stringify(report.pageErrors),'## HTTP errors',JSON.stringify(report.httpErrors)];fs.writeFileSync(path.join(out,'evidence.md'),lines.join('\n'));await c.close();await b.close();console.log('COMPLETE '+JSON.stringify({actions,reached,limits:report.limits.length,errors:report.pageErrors,fatal:report.fatal||null}));}
