const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({deviceScaleFactor:2})).newPage();
await p.goto('file://'+process.cwd()+'/gift.html',{waitUntil:'networkidle'});await p.waitForTimeout(600);
for(const id of ['A','B']){const el=await p.$('#'+id);await el.screenshot({path:'gift_'+id+'.png'});}
console.log('ok');await b.close();})();
