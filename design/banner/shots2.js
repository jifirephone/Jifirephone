const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:1080,height:1920},deviceScaleFactor:2})).newPage();
await p.goto('file://'+process.cwd()+'/story2.html',{waitUntil:'networkidle'});await p.waitForTimeout(600);
const el=await p.$('.st');await el.screenshot({path:'story2.png'});console.log('ok');await b.close();})();
