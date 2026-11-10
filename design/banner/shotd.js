const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:1920,height:720},deviceScaleFactor:2})).newPage();
await p.goto('file://'+process.cwd()+'/disc.html',{waitUntil:'networkidle'});await p.waitForTimeout(600);
const el=await p.$('.ban');await el.screenshot({path:'disc.png'});console.log('ok');await b.close();})();
