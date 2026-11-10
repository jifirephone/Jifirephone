const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:1536,height:1024},deviceScaleFactor:2})).newPage();
await p.goto('file://'+process.cwd()+'/prod.html',{waitUntil:'networkidle'});await p.waitForTimeout(600);
const el=await p.$('.ad');await el.screenshot({path:'prod.png'});console.log('ok');await b.close();})();
