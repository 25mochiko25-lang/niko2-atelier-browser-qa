import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { webkit } = require('/tmp/niko2-live-observer/node_modules/playwright');
const repo = process.env.GITHUB_REPOSITORY;
const token = process.env.GITHUB_TOKEN;
const config = JSON.parse(fs.readFileSync(process.env.SESSION_REQUEST, 'utf8'));
const session = config.session;
if (!/^[a-z0-9-]+$/.test(session)) throw new Error('Invalid session ID');
const target = new URL(config.target);
if (target.protocol !== 'https:' || !['niko2-atelier-combined-preview.25mochiko25.workers.dev','niko2atelier.com'].includes(target.hostname)) throw new Error('Unapproved target');
const device = config.device || 'mobile';
if (!['mobile','desktop'].includes(device)) throw new Error('Unsupported device profile');
const profile = device === 'desktop'
  ? { viewport:{width:1440,height:900}, isMobile:false, hasTouch:false }
  : { viewport:{width:390,height:844}, isMobile:true, hasTouch:true };

const controlPath = `live-control/${session}.json`;
const root = `live-results/${session}`;
const headers = {Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'};
const sleep = ms => new Promise(r=>setTimeout(r,ms));
async function api(path, options={}) {
  const response = await fetch(`https://api.github.com/repos/${repo}/${path}`,{...options,headers:{...headers,...options.headers}});
  if (response.status===404) return null;
  if (!response.ok) throw new Error(`GitHub ${response.status}: ${(await response.text()).slice(0,300)}`);
  return await response.json();
}
async function read(path) {
  const value = await api(`contents/${path}?ref=main`);
  return value ? JSON.parse(Buffer.from(value.content,'base64').toString()) : null;
}
async function write(path, bytes) {
  for(let attempt=0;attempt<4;attempt++) {
    const old=await api(`contents/${path}?ref=main`);
    try {
      return await api(`contents/${path}`,{method:'PUT',body:JSON.stringify({message:`qa: ${session} observed state`,branch:'main',content:Buffer.from(bytes).toString('base64'),...(old?{sha:old.sha}:{})})});
    } catch(e) {if(attempt===3)throw e;await sleep(800);}
  }
}
const events=[],pageErrors=[],httpErrors=[];
let browser,context,page,stopReason=null,lastCommand=null,lastAt=Date.now();
const startedAt=new Date().toISOString();
async function publish(action,error=null) {
  const png=await page.screenshot({type:'jpeg',quality:84,timeout:15000});
  const image=await write(`${root}/current.jpg`,png);
  const screenshotUrl=`https://raw.githubusercontent.com/${repo}/${image.commit.sha}/${root}/current.jpg`;
  const visible=await page.evaluate(()=>{
    const isVisible=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>1&&r.height>1&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth&&s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)>0.02&&!e.closest('[hidden]');};
    return {url:location.href,title:document.title,viewport:{width:innerWidth,height:innerHeight},documentWidth:document.documentElement.scrollWidth,scroll:{x:scrollX,y:scrollY},text:document.body.innerText.slice(0,12000),controls:[...document.querySelectorAll('button,a,input,textarea,select,[role="button"]')].filter(isVisible).map(e=>{const r=e.getBoundingClientRect();return {tag:e.tagName,text:(e.innerText||e.getAttribute('aria-label')||e.getAttribute('title')||e.getAttribute('placeholder')||'').trim().slice(0,160),disabled:!!e.disabled,rect:{x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)}};}).slice(0,60)};
  });
  events.push({number:events.length+1,at:new Date().toISOString(),action,error,url:page.url(),screenshotUrl,text:visible.text});
  await write(`${root}/state.json`,JSON.stringify({session,mode:'observer-driven',device,engine:'webkit',mobile:profile.isMobile,touch:profile.hasTouch,startedAt,updatedAt:new Date().toISOString(),lastCommand,stopReason,action,error,screenshotUrl,...visible,pageErrors,httpErrors,events},null,2));
  console.log(JSON.stringify({session,device,number:events.length,lastCommand,action:action.op,url:page.url(),stopReason}));
}
try {
  browser=await webkit.launch({headless:true});
  context=await browser.newContext({...profile,locale:'ja-JP',timezoneId:'Asia/Tokyo'});
  page=await context.newPage();
  page.on('pageerror',e=>pageErrors.push(String(e)));
  page.on('response',r=>{if(r.status()>=400)httpErrors.push({url:r.url(),status:r.status()});});
  await page.goto(target.href,{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForTimeout(1800);
  await publish({op:'arrival'});
  while(!stopReason) {
    // Safety guards are infrastructure stops, never evidence of visitor boredom.
    if(Date.now()-lastAt>20*60*1000){stopReason='infrastructure_idle_timeout';await publish({op:'infrastructure-stop'});break;}
    const command=await read(controlPath);
    if(!command || command.id===lastCommand){await sleep(2500);continue;}
    lastCommand=command.id;lastAt=Date.now();let error=null;
    try {
      if(command.op==='tap') {
        const x=Number(command.x), y=Number(command.y);
        if(profile.hasTouch) await page.touchscreen.tap(x,y);
        else await page.mouse.click(x,y);
      }
      else if(command.op==='scroll'){
        const defaultX=Math.round(profile.viewport.width/2);
        const defaultY=Math.round(profile.viewport.height*0.72);
        await page.mouse.move(Number(command.x??defaultX),Number(command.y??defaultY));
        await page.mouse.wheel(Number(command.dx??0),Number(command.dy??500));
      }
      else if(command.op==='type') await page.keyboard.insertText(String(command.text));
      else if(command.op==='key') await page.keyboard.press(String(command.key));
      else if(command.op==='back') await page.goBack({waitUntil:'domcontentloaded',timeout:15000});
      else if(command.op==='forward') await page.goForward({waitUntil:'domcontentloaded',timeout:15000});
      else if(command.op==='reload') await page.reload({waitUntil:'domcontentloaded',timeout:30000});
      else if(command.op==='stop') stopReason=String(command.reason||'observer_finished');
      else if(!['look','wait','note'].includes(command.op)) throw new Error('Unsupported operation');
      await page.waitForTimeout(Math.max(0,Math.min(20000,Number(command.wait??900))));
    }catch(e){error=String(e);}
    await publish(command,error);
  }
}catch(e){
  stopReason='infrastructure_error';
  await write(`${root}/failure.json`,JSON.stringify({session,device,stopReason,error:String(e),events,pageErrors,httpErrors},null,2)).catch(()=>{});
  throw e;
}finally{await context?.close();await browser?.close();}
