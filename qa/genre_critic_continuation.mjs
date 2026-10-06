import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const {webkit}=require(process.env.PLAYWRIGHT_MODULE||'/tmp/niko2-browser-qa/node_modules/playwright');
const id=process.env.REQUEST;
if(!/^genre-critic-[a-zA-Z0-9_-]+$/.test(id||'')) throw Error('Invalid own request id');
const req=JSON.parse(fs.readFileSync(`requests/${id}.json`,'utf8'));
const out=process.env.OUTDIR||'qa-output/genre-critic';
fs.mkdirSync(out,{recursive:true});
const origin=new URL(req.target).origin;
if(!/^https:\/\/(niko2atelier\.com|niko2[^/]*\.workers\.dev)$/.test(origin)) throw Error('Target rejected');
const report={request:id,target:req.target,mode:'human-selected actions through remote WebKit',viewport:{width:390,height:844},engine:'webkit',events:[],observations:[],errors:[],httpErrors:[],startedAt:new Date().toISOString()};
const safe=s=>String(s).replace(/[^a-zA-Z0-9_-]/g,'_').slice(0,70);
const ownPath=s=>{if(!/^results\/\d+-genre-critic-six-[a-zA-Z0-9_-]+\/(storage-state|session-storage|resume)\.json$/.test(s))throw Error('Not an own continuation file');return s;};
let seq=0;
const browser=await webkit.launch({headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1,locale:'ja-JP',timezoneId:'Asia/Tokyo',...(req.storageState?{storageState:ownPath(req.storageState)}:{})});
if(req.sessionStorage){const data=JSON.parse(fs.readFileSync(ownPath(req.sessionStorage),'utf8'));await context.addInitScript(({data,origin})=>{if(location.origin===origin)for(const [k,v]of Object.entries(data))sessionStorage.setItem(k,v);},{data,origin});}
const page=await context.newPage();
page.on('pageerror',e=>report.errors.push(String(e)));
page.on('response',r=>{if(r.status()>=400)report.httpErrors.push({url:r.url(),status:r.status()});});
const wait=ms=>page.waitForTimeout(ms);
async function state(){return await page.evaluate(()=>{
 const shown=e=>{if(!e)return false;for(let n=e;n&&n.nodeType===1;n=n.parentElement){const s=getComputedStyle(n);if(n.hidden||n.inert||s.display==='none'||s.visibility==='hidden'||Number(s.opacity)<0.02)return false;}const r=e.getBoundingClientRect();return r.width>1&&r.height>1;};
 const label=e=>(e.innerText||e.getAttribute('aria-label')||e.getAttribute('title')||e.getAttribute('placeholder')||e.value||'').trim().replace(/\s+/g,' ').slice(0,180);
 const controls=[...document.querySelectorAll('button,a,[role=button],[role=tab],summary,input,select,textarea')].filter(shown).map(e=>{const r=e.getBoundingClientRect();const x=Math.max(1,Math.min(innerWidth-2,r.x+r.width/2)),y=Math.max(1,Math.min(innerHeight-2,r.y+r.height/2));const h=document.elementFromPoint(x,y);return{tag:e.tagName,id:e.id,cls:typeof e.className==='string'?e.className:'',text:label(e),type:e.getAttribute('type'),href:e.getAttribute('href'),disabled:!!e.disabled,rect:{x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)},onScreen:r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth,hit:!!h&&(h===e||e.contains(h))};});
 const viewportTexts=[];const walk=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=walk.nextNode()){const t=n.textContent.trim();if(!t||!shown(n.parentElement))continue;const range=document.createRange();range.selectNodeContents(n);const rs=[...range.getClientRects()];if(rs.some(r=>r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth)){const r=rs.find(r=>r.bottom>0&&r.top<innerHeight);const h=document.elementFromPoint(Math.max(1,Math.min(innerWidth-1,r.x+r.width/2)),Math.max(1,Math.min(innerHeight-1,r.y+r.height/2)));if(h&&(h===n.parentElement||n.parentElement.contains(h)))viewportTexts.push(t);}}
 return{url:location.href,route:document.querySelector('.view.is-active')?.dataset.view||null,viewportText:viewportTexts.join('\n').slice(0,12000),renderedBodyText:(document.body.innerText||'').slice(0,18000),controls:controls.slice(0,180),scroll:{x:scrollX,y:scrollY,h:document.scrollingElement.scrollHeight},scrollContainers:[...document.querySelectorAll('main,section,div,dialog')].filter(e=>shown(e)&&e.scrollHeight>e.clientHeight+40&&/auto|scroll/.test(getComputedStyle(e).overflowY)).slice(0,12).map(e=>({id:e.id,cls:e.className,top:e.scrollTop,height:e.clientHeight,scrollHeight:e.scrollHeight})),dialogs:[...document.querySelectorAll('dialog[open],[role=dialog]')].filter(shown).map(e=>({id:e.id,text:label(e)}))};
 });}
async function snap(label,picture=false){const s=await state();const n=String(++seq).padStart(3,'0');const filename=`${n}-${safe(label)}`;if(picture){try{await page.screenshot({path:path.join(out,filename+'.jpg'),type:'jpeg',quality:70,timeout:8000});s.screenshot=filename+'.jpg';}catch(e){s.screenshotError=String(e);}}report.observations.push({label,...s});fs.writeFileSync(path.join(out,filename+'.json'),JSON.stringify({label,...s},null,2));return s;}
async function resolve(a){let l;if(a.selector)l=page.locator(a.selector);else if(a.name){const name=a.regex?new RegExp(a.name,a.ignoreCase===false?'':'i'):a.name;l=page.getByRole(a.role||'button',{name,exact:!a.regex});}else throw Error('Missing visible target');if(a.nth!==undefined)l=l.nth(a.nth);else l=l.first();await l.waitFor({state:'visible',timeout:a.timeout||10000});return l;}
async function tap(a){const l=await resolve(a);if(await l.isDisabled().catch(()=>false))throw Error('Visible target is disabled');await l.scrollIntoViewIfNeeded({timeout:4000}).catch(()=>{});const point=await l.evaluate(e=>{const r=e.getBoundingClientRect();const left=Math.max(r.left,1),right=Math.min(r.right,innerWidth-2),top=Math.max(r.top,1),bottom=Math.min(r.bottom,innerHeight-2);if(left>=right||top>=bottom)return null;for(const u of [.5,.25,.75,.1,.9])for(const v of [.5,.25,.75,.1,.9]){const x=left+(right-left)*u,y=top+(bottom-top)*v;const h=document.elementFromPoint(x,y);if(h&&(h===e||e.contains(h)))return{x,y,label:(e.innerText||e.getAttribute('aria-label')||'').trim(),id:e.id};}return null;});if(!point)throw Error('Target is covered or off-screen; not forced');await page.touchscreen.tap(point.x,point.y);return point;}
try{
 let start=req.target;if(req.resume){const r=JSON.parse(fs.readFileSync(ownPath(req.resume),'utf8'));if(new URL(r.url).origin!==origin)throw Error('Bad resume origin');start=r.url;}
 report.startUrl=start;report.httpStatus=(await page.goto(start,{waitUntil:'domcontentloaded',timeout:30000}))?.status();await wait(req.arrivalWait||1500);await snap('arrival',true);
 for(let i=0;i<(req.actions||[]).length;i++){
  const a=req.actions[i],before=await state();let result=null,error=null;
  try{
   if(a.kind==='tap')result=await tap(a);
   else if(a.kind==='wait')await wait(a.ms||1500);
   else if(a.kind==='scroll')result=await page.evaluate(({dy,selector})=>{let e=selector?document.querySelector(selector):document.elementFromPoint(innerWidth*.5,innerHeight*.65);if(!selector)while(e&&!(e.scrollHeight>e.clientHeight+20&&/auto|scroll/.test(getComputedStyle(e).overflowY)))e=e.parentElement;e=e||document.scrollingElement;const before=e.scrollTop;e.scrollBy({top:dy,behavior:'instant'});return{tag:e.tagName,id:e.id,cls:e.className,before,after:e.scrollTop};},{dy:a.dy||620,selector:a.selector});
   else if(a.kind==='fill'){const l=await resolve(a);await l.fill(a.value);}
   else if(a.kind==='back')await page.goBack({waitUntil:'domcontentloaded',timeout:10000});
   else if(a.kind==='forward')await page.goForward({waitUntil:'domcontentloaded',timeout:10000});
   else if(a.kind==='reload')await page.reload({waitUntil:'domcontentloaded',timeout:20000});
   else if(a.kind!=='observe')throw Error('Unsupported action');
   await wait(a.wait??1000);
  }catch(e){error=String(e);}
  const after=await snap(a.label||`${i+1}-${a.kind}`,!!a.picture);
  report.events.push({step:i+1,action:a,result,error,before:{url:before.url,route:before.route},after:{url:after.url,route:after.route}});
  console.log(JSON.stringify({step:i+1,label:a.label,route:after.route,error,text:after.viewportText.slice(0,350)}));
  if(error&&!a.optional){report.stopReason='action failed; return current evidence rather than pretend later steps happened';break;}
 }
 report.final=await snap('final',true);
}catch(e){report.fatal=String(e.stack||e);}
finally{
 report.finishedAt=new Date().toISOString();
 await context.storageState({path:path.join(out,'storage-state.json')});
 const session=await page.evaluate(()=>Object.fromEntries(Object.keys(sessionStorage).map(k=>[k,sessionStorage.getItem(k)]))).catch(()=>({}));
 fs.writeFileSync(path.join(out,'session-storage.json'),JSON.stringify(session,null,2));
 fs.writeFileSync(path.join(out,'resume.json'),JSON.stringify({url:page.url()},null,2));
 fs.writeFileSync(path.join(out,'observations.json'),JSON.stringify(report,null,2));
 fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify({request:id,startUrl:report.startUrl,startedAt:report.startedAt,finishedAt:report.finishedAt,httpStatus:report.httpStatus,fatal:report.fatal,stopReason:report.stopReason,events:report.events,observations:report.observations.map(s=>({label:s.label,url:s.url,route:s.route,viewportText:s.viewportText,screenshot:s.screenshot})),errors:report.errors,httpErrors:report.httpErrors},null,2));
 await browser.close();
}
