// Visitor 3 follow-up. Browser observations and normal UI inputs only.
// No product source reads, app-state injection, forced clicks, or screenshots.
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {webkit}=require('/tmp/niko2-browser-qa/node_modules/playwright');
const request=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const TARGET=request.target||'https://niko2-atelier-combined-preview.25mochiko25.workers.dev/';
if(new URL(TARGET).origin!=='https://niko2-atelier-combined-preview.25mochiko25.workers.dev') throw Error('Preview-only runner');
const OUT=process.env.OUT||'qa-output/result.json';
const report={target:TARGET,request:process.argv[2],startedAt:new Date().toISOString(),method:'isolated WebKit contexts, real point input and ordinary history navigation',cases:[]};
fs.mkdirSync(path.dirname(OUT),{recursive:true});
function save(){fs.writeFileSync(OUT,JSON.stringify(report,null,2));}
const browser=await webkit.launch({headless:true});
async function state(p){return p.evaluate(()=>{
  const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
  const name=e=>clean(e?.getAttribute?.('aria-label')||e?.innerText||e?.getAttribute?.('title')||'').slice(0,180);
  function visible(e){if(!e)return false;const r=e.getBoundingClientRect();if(r.width<2||r.height<2)return false;for(let a=e;a;a=a.parentElement){const s=getComputedStyle(a);if(a.hidden||s.display==='none'||s.visibility==='hidden'||Number(s.opacity)<0.01)return false;}return true;}
  const rect=e=>{const r=e.getBoundingClientRect();return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)};};
  const describe=e=>{const b=e?.closest?.('button,a,[role=button],input,textarea,select')||e;return b?{tag:b.tagName,id:b.id||'',name:name(b),cls:typeof b.className==='string'?b.className.slice(0,180):''}:null;};
  document.querySelectorAll('[data-qa-check-id]').forEach(e=>e.removeAttribute('data-qa-check-id'));
  const controls=[...document.querySelectorAll('button,a,[role=button],summary,input,textarea,select')].filter(visible).slice(0,180).map((e,i)=>{
    e.setAttribute('data-qa-check-id',String(i));const r=e.getBoundingClientRect();const l=Math.max(1,r.left),t=Math.max(1,r.top),rr=Math.min(innerWidth-1,r.right),bb=Math.min(innerHeight-1,r.bottom);const points=[];
    if(rr>l&&bb>t)for(const yy of [0.5,0.2,0.8])for(const xx of [0.5,0.2,0.8]){const x=Math.round(l+(rr-l)*xx),y=Math.round(t+(bb-t)*yy);const h=document.elementFromPoint(x,y);points.push({x,y,own:!!h&&(h===e||e.contains(h)),hit:describe(h)});}
    const scrollParents=[];for(let a=e.parentElement;a&&a!==document.body;a=a.parentElement)if(a.scrollHeight>a.clientHeight+3||a.scrollWidth>a.clientWidth+3)scrollParents.push({id:a.id,cls:typeof a.className==='string'?a.className.slice(0,70):'',top:a.scrollTop,left:a.scrollLeft,w:a.clientWidth,h:a.clientHeight});
    return {...describe(e),probe:i,rect:rect(e),disabled:!!e.disabled||e.getAttribute('aria-disabled')==='true',href:e.getAttribute('href')||'',value:e.matches('input,textarea,select')?e.value:undefined,points,scrollParents};
  });
  const active=document.querySelector('.view.is-active');
  const text=clean(document.body.innerText);
  const texts=[];const walk=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
  while((n=walk.nextNode())&&texts.length<100){if(!clean(n.textContent)||!visible(n.parentElement))continue;const range=document.createRange();range.selectNodeContents(n);for(const r of range.getClientRects()){if(r.bottom<=0||r.top>=innerHeight||r.right<=0||r.left>=innerWidth)continue;const x=Math.max(1,Math.min(innerWidth-1,r.left+r.width/2)),y=Math.max(1,Math.min(innerHeight-1,r.top+r.height/2));const h=document.elementFromPoint(x,y);if(h&&(h===n.parentElement||n.parentElement.contains(h))){texts.push(clean(n.textContent));break;}}}
  return {url:location.href,route:active?.dataset.view||null,activeViews:document.querySelectorAll('.view.is-active').length,historyLength:history.length,historyRoute:history.state?.niko2Route||null,viewport:{w:innerWidth,h:innerHeight},scroll:{x:scrollX,y:scrollY,w:document.documentElement.scrollWidth,h:document.documentElement.scrollHeight},horizontalOverflow:document.documentElement.scrollWidth>innerWidth+3,bodyText:text.slice(0,8500),onscreenText:texts.join(' ').slice(0,5000),found:[...document.querySelectorAll('.view.is-active .collectible.is-found')].map(name),controls,inputs:(window.__visitor3Inputs||[]).slice(-8)};
}).catch(e=>({stateError:String(e),url:p.url()}));}
function compact(s){return {...s,controls:(s.controls||[]).map(c=>({...c,points:c.points.filter(p=>p.own).slice(0,1)}))};}
for(const spec of request.cases||[]){
  const mobile=spec.mobile!==false;
  const context=await browser.newContext({viewport:spec.viewport||{width:390,height:844},isMobile:mobile,hasTouch:mobile,locale:'ja-JP',timezoneId:'Asia/Tokyo'});
  await context.addInitScript(()=>{window.__visitor3Inputs=[];for(const type of ['pointerdown','click'])document.addEventListener(type,e=>{const a=e.target.closest?.('button,a,[role=button],input,textarea,select')||e.target;window.__visitor3Inputs.push({type,x:e.clientX,y:e.clientY,id:a.id||'',name:a.getAttribute?.('aria-label')||String(a.innerText||'').trim().slice(0,160),cls:typeof a.className==='string'?a.className.slice(0,160):''});if(window.__visitor3Inputs.length>20)window.__visitor3Inputs.shift();},true);});
  const p=await context.newPage();p.setDefaultTimeout(4500);
  const rec={name:spec.name,mobile,viewport:spec.viewport||{width:390,height:844},startedAt:new Date().toISOString(),events:[],checkpoints:[],pageErrors:[],httpErrors:[]};report.cases.push(rec);
  p.on('pageerror',e=>rec.pageErrors.push(String(e)));
  p.on('response',r=>{if(r.status()>=400){const u=new URL(r.url());rec.httpErrors.push({status:r.status(),url:u.origin+u.pathname});}});
  async function snap(label){const s=await state(p);rec.checkpoints.push({label,...compact(s)});save();return s;}
  async function action(label,fn,wait=1100){const before=await state(p);let error=null,detail=null;try{detail=await fn(before);}catch(e){error=String(e.stack||e);}await p.waitForTimeout(wait);const after=await state(p);const row={label,error,detail,before:compact(before),after:compact(after)};rec.events.push(row);console.log(JSON.stringify({case:spec.name,label,error,from:before.route,to:after.route,found:after.found,text:after.onscreenText?.slice(-350)}));save();return after;}
  function choose(s,q={}){return (s.controls||[]).find(c=>!c.disabled&&(q.id?c.id===q.id:true)&&(q.text?new RegExp(q.text,'i').test(c.name):true)&&(q.cls?new RegExp(q.cls).test(c.cls):true)&&(q.safe===false||c.points.some(p=>p.own)));}
  async function point(c,mode='safe'){if(!c)throw Error('No matching visible reachable control');const pt=mode==='center'?c.points[0]:c.points.find(x=>x.own);if(!pt)throw Error('No on-screen point for '+c.name);if(mobile)await p.touchscreen.tap(pt.x,pt.y);else await p.mouse.click(pt.x,pt.y);return {intended:c.name,id:c.id,mode,point:pt};}
  async function click(q,label,wait=1100){return action(label,async s=>{
    if(q.selector){const all=p.locator(q.selector);let loc;for(let i=0;i<await all.count();i++)if(await all.nth(i).isVisible()){loc=all.nth(i);break;}if(!loc)throw Error('No visible selector '+q.selector);
      if(q.method==='locator'){if(mobile)await loc.tap();else await loc.click();return {selector:q.selector,method:'locator with automatic scroll'};}
      const probe=await loc.getAttribute('data-qa-check-id');const c=s.controls.find(c=>String(c.probe)===probe);return point(c,q.mode);
    }
    return point(choose(s,{...q,safe:q.mode!=='center'}),q.mode);
  },wait);}
  async function intro(){for(let i=0;i<9;i++){let s=await state(p);const next=choose(s,{cls:'niko2-intro-primary'});if(!next)break;if(next.disabled)break;await click({cls:'niko2-intro-primary'},'intro '+next.name,1000);} }
  async function enter(){let s=await state(p);if(s.route==='home'&&choose(s,{id:'enterGarden'}))await click({id:'enterGarden'},'Enter the dream',1100);await intro();s=await state(p);if(choose(s,{id:'beginGarden'}))await click({id:'beginGarden'},'この空へ入る',1800);await snap('garden-ready');}
  async function collect(n,leaveOpen=false){const initial=(await state(p)).found?.length||0;for(let i=0;i<12;i++){let s=await state(p);if(s.route!=='garden')throw Error('Cannot collect outside garden');if((s.found?.length||0)>=initial+n)break;const c=(s.controls||[]).find(c=>/\bcollectible\b/.test(c.cls)&&!/\bis-found\b/.test(c.cls)&&!c.disabled&&c.points.some(p=>p.own));if(!c)throw Error('No reachable uncollected object');await click({id:c.id||undefined,text:'^'+c.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$')+'$'},'collect '+c.name,1400);s=await state(p);if(leaveOpen&&(s.found?.length||0)>=initial+n)break;if(choose(s,{id:'closeMemory'}))await click({id:'closeMemory'},'close acquired fragment',1300);}
    await snap('collection checkpoint');}
  try{
    rec.httpStatus=(await p.goto(TARGET,{waitUntil:'domcontentloaded',timeout:30000}))?.status();await p.waitForTimeout(2200);await snap('arrival');
    for(const step of spec.steps||[]){
      const label=step.label||step.op;
      if(step.op==='enter')await enter();
      else if(step.op==='intro')await intro();
      else if(step.op==='collect')await collect(step.n||1,step.leaveOpen);
      else if(step.op==='click')await click(step,label,step.wait||1100);
      else if(step.op==='observe')await snap(label);
      else if(step.op==='wait'){await p.waitForTimeout(step.ms||2000);await snap(label);}
      else if(step.op==='back')await action(label,()=>p.goBack({waitUntil:'domcontentloaded',timeout:10000}),step.wait||1800);
      else if(step.op==='forward')await action(label,()=>p.goForward({waitUntil:'domcontentloaded',timeout:10000}),step.wait||1800);
      else if(step.op==='reload')await action(label,()=>p.reload({waitUntil:'domcontentloaded',timeout:20000}),step.wait||2200);
      else if(step.op==='resize')await action(label,()=>p.setViewportSize(step.viewport),1500);
      else if(step.op==='scroll')await action(label,()=>p.evaluate(({x,y})=>window.scrollBy(x,y),{x:step.x||0,y:step.y||500}),1000);
      else if(step.op==='probe'){
        const s=await state(p);rec.checkpoints.push({label,...s,controls:s.controls.filter(c=>new RegExp(step.text||'花|石の柱').test(c.name))});save();
      }
      else if(step.op==='assert'){
        const s=await state(p);const ok=(!step.route||s.route===step.route)&&(step.found===undefined||s.found?.length===step.found)&&(!step.text||new RegExp(step.text).test(s.bodyText||''));rec.checkpoints.push({label,assertion:step,pass:ok,...compact(s)});if(!ok&&step.required!==false)throw Error('Prerequisite failed: '+JSON.stringify(step));
      }
      else if(step.op==='browse'){
        const seen=new Map();for(let i=0;i<(step.steps||20);i++){const s=await state(p);let c=choose(s,{cls:'niko2-intro-primary'})||choose(s,{id:'closeMemory'});if(!c){const candidates=(s.controls||[]).filter(c=>!c.disabled&&c.points.some(p=>p.own)&&!/(送信|SEND|削除|DELETE|購入|決済)/i.test(c.name));c=candidates.map(c=>{const key=s.route+'|'+c.id+'|'+c.name;let v=100-(seen.get(key)||0)*150;if(/sound/i.test(c.id))v-=800;if(/WORLD|Diary|Lab|Hotel|香|部屋|もふもふ|記録|見る|入る|調合|Home|戻る/i.test(c.name))v+=40;if(/collectible/.test(c.cls)&&!/is-found/.test(c.cls))v+=130;return {c,v,key};}).sort((a,b)=>b.v-a.v)[0]?.c;}
          if(!c)break;const key=s.route+'|'+c.id+'|'+c.name;if((seen.get(key)||0)>=2)break;seen.set(key,(seen.get(key)||0)+1);await action('wander '+(i+1)+' '+c.name,()=>point(c),1300);
        }
      }
      else throw Error('Unknown operation '+step.op);
    }
  }catch(e){rec.fatal=String(e.stack||e);}
  await snap('final');rec.finishedAt=new Date().toISOString();await context.close();save();
}
await browser.close();report.finishedAt=new Date().toISOString();save();
console.log(JSON.stringify({finished:true,cases:report.cases.map(c=>({name:c.name,events:c.events.length,fatal:c.fatal||null,errors:c.events.filter(e=>e.error).length}))}));
