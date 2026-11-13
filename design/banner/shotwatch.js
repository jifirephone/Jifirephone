const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:1080,height:1350},deviceScaleFactor:1})).newPage();
await p.goto('file://'+process.cwd()+'/watch.html',{waitUntil:'networkidle'});await p.waitForTimeout(500);await p.screenshot({path:'../../out/post_watch_gt5pro_375k.png'});await b.close();})();
