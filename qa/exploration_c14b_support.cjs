const fs=require('node:fs');
if(process.argv[2]==='prepare'){
  let s=fs.readFileSync('qa/exploration_checks_c14b.mjs','utf8');
  s=s.replace('detail=await fn(before);','detail=await fn(before);if(detail && typeof detail.status === "function")detail={httpStatus:detail.status(),url:detail.url()};');
  s=s.replace("const next=choose(s,{cls:'niko2-intro-primary'});", "const choices=(s.controls||[]).filter(c=>/niko2-intro-concept-button/.test(c.cls)&&c.points.some(p=>p.own));if(choices.length&&!choices.some(c=>/is-selected/.test(c.cls))){await click({text:'^'+choices[0].name+'$'},'choose intro concept',900);s=await state(p);}const next=choose(s,{cls:'niko2-intro-primary'});");
  s=s.replace("else throw Error('Unknown operation '+step.op);",`else if(step.op==='point')await action(label,async()=>{const hit=await p.evaluate(({x,y})=>{const e=document.elementFromPoint(x,y);const a=e?.closest('button,a,[role=button]')||e;return {id:a?.id||'',name:a?.getAttribute('aria-label')||a?.innerText||'',cls:typeof a?.className==='string'?a.className:''};},{x:step.x,y:step.y});if(mobile)await p.touchscreen.tap(step.x,step.y);else await p.mouse.click(step.x,step.y);return {x:step.x,y:step.y,hit,method:'viewport coordinate; no auto-scroll'};},step.wait||1200);
      else if(step.op==='fill')await action(label,()=>p.locator(step.selector).fill(step.value),900);
      else if(step.op==='scrollElement')await action(label,()=>p.locator(step.selector).evaluate((e,v)=>e.scrollBy(v.x||0,v.y||0),step),1000);
      else if(step.op==='goto')await action(label,()=>p.goto(new URL(step.path,TARGET).href,{waitUntil:'domcontentloaded',timeout:20000}),2000);
      else throw Error('Unknown operation '+step.op);`);
  s=s.replace("const key=s.route+'|'+c.id+'|'+c.name;if((seen.get(key)||0)>=2)break;", "const key=s.route+'|'+c.id+'|'+c.name+'|'+s.onscreenText?.slice(-200);if((seen.get(key)||0)>=2)break;");
  // Snapshot errors are evidence collection errors, not proof that the site lost its view.
  fs.writeFileSync('/tmp/exploration-c14b.mjs',s);
}else if(process.argv[2]==='digest'){
  const req=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));
  const files=[...(req.inspectResults||[]),'qa-output/result.json'];
  const lines=['# Visitor 3 compact browser evidence'];
  for(const file of files){
    if(file!=='qa-output/result.json'&&!/^results\/37508599014-exploration-c14b-followup-001\.json$/.test(file))throw Error('Only own earlier run may be inspected');
    const r=JSON.parse(fs.readFileSync(file,'utf8'));
    lines.push('','## Source '+file,'Target: '+r.target,'Started: '+r.startedAt,'Finished: '+r.finishedAt);
    for(const c of r.cases||[]){
      lines.push('','### Case '+c.name,JSON.stringify({viewport:c.viewport,mobile:c.mobile,events:c.events.length,fatal:c.fatal||null,pageErrors:c.pageErrors,httpErrors:c.httpErrors}));
      for(const [i,e] of c.events.entries()){
        const b=e.before||{},a=e.after||{};
        lines.push(JSON.stringify({event:i+1,label:e.label,from:b.route,to:a.route,fromCount:b.found?.length,toCount:a.found?.length,error:e.error||null,stateError:a.stateError||null,input:e.detail,received:a.inputs?.slice(-2),text:a.onscreenText||a.bodyText?.slice(-1400)},null,0));
      }
      for(const s of c.checkpoints||[])if(!['arrival','garden-ready','collection checkpoint'].includes(s.label)){
        lines.push('Checkpoint '+s.label+': '+JSON.stringify({route:s.route,found:s.found,pass:s.pass,stateError:s.stateError,text:s.onscreenText||s.bodyText?.slice(-2000)}));
        if(s.label==='final'||s.label.startsWith('probe'))lines.push('Controls '+s.label+': '+JSON.stringify((s.controls||[]).map(c=>({id:c.id,name:c.name,cls:c.cls,rect:c.rect,points:c.points,scrollParents:c.scrollParents})),null,0));
      }
    }
  }
  fs.writeFileSync('qa-output/digest.md',lines.join('\n'));
}else throw Error('Unknown support mode');
