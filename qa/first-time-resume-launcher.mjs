import fs from 'node:fs';
let source=fs.readFileSync('qa/live-observer.mjs','utf8');
source=source.replaceAll('?ref=main','?ref=qa%2Ffirst-time-gogo-isolated-002').replaceAll("branch:'main'","branch:'qa/first-time-gogo-isolated-002'");
const arrival="await publish({op:'arrival'});";
if(!source.includes(arrival))throw Error('Observer arrival contract changed');
source=source.replace(arrival,`
  if(config.replay){
    const raw=await api('contents/'+config.replay.path+'?ref='+encodeURIComponent(config.replay.ref));
    if(!raw)throw Error('Missing replay record');
    const prior=JSON.parse(Buffer.from(raw.content,'base64').toString());
    let reached=false;
    for(const e of prior.events){
      const c=e.action;
      if(['tap','wait','key','type'].includes(c.op)){
        if(c.op==='tap')await page.touchscreen.tap(Number(c.x),Number(c.y));
        if(c.op==='key')await page.keyboard.press(String(c.key));
        if(c.op==='type')await page.keyboard.insertText(String(c.text));
        await page.waitForTimeout(Math.max(500,Math.min(20000,Number(c.wait??900))));
        events.push({number:events.length+1,at:new Date().toISOString(),action:{...c,replayed:true},error:null,url:page.url(),screenshotUrl:null,text:'Recorded UI replay for continuation, not a new first impression.'});
      }
      if(c.id===config.replay.through){reached=true;break;}
    }
    if(!reached)throw Error('Replay boundary missing');
  }
  await publish({op:'reconstructed-arrival',source:config.replay});
  lastAt=Date.now();
`);
const wheel="else if(command.op==='scroll'){await page.mouse.move(Number(command.x??195),Number(command.y??600));await page.mouse.wheel(Number(command.dx??0),Number(command.dy??500));}";
if(!source.includes(wheel))throw Error('Observer scroll contract changed');
source=source.replace(wheel,`else if(command.op==='scroll'){
 await page.evaluate(({x,y,dx,dy})=>{let e=document.elementFromPoint(x,y);while(e){const s=getComputedStyle(e);if(/auto|scroll/.test(s.overflowY)&&e.scrollHeight>e.clientHeight+2){e.scrollBy(dx,dy);return;}e=e.parentElement;}window.scrollBy(dx,dy);},{x:Number(command.x??195),y:Number(command.y??600),dx:Number(command.dx??0),dy:Number(command.dy??500)});
}`);
fs.writeFileSync('/tmp/first-time-resume-observer.mjs',source);
await import('file:///tmp/first-time-resume-observer.mjs');
