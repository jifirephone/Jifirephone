const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:1080,height:1350},deviceScaleFactor:1})).newPage();
await p.goto('file://'+process.cwd()+'/gta.html',{waitUntil:'networkidle'});await p.waitForTimeout(500);await p.screenshot({path:'../../out/post_gta6_150k.png'});await b.close();})();
