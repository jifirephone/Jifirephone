const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({deviceScaleFactor:2})).newPage();
const html=fs.readFileSync('banner.html','utf8');
for(const t of ['A','B','C']){
  fs.writeFileSync(`_t_${t}.html`, html.replace('class="ban THEME"',`class="ban ${t}"`));
  await p.goto('file://'+process.cwd()+`/_t_${t}.html`,{waitUntil:'networkidle'});
  await p.waitForTimeout(600);
  const el=await p.$('.ban');await el.screenshot({path:`ban_${t}.png`});console.log('ok',t);
}
await b.close();})();
