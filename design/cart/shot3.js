const {chromium, devices} = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({...devices['iPhone 13'], deviceScaleFactor: 3})).newPage();
  await p.goto('file://' + process.cwd() + '/cart_v3.html'); await p.waitForTimeout(800);
  await p.screenshot({path: 'v3_view1.png'});
  await p.evaluate(() => window.scrollTo(0, 700)); await p.waitForTimeout(300);
  await p.screenshot({path: 'v3_view2.png'});
  await p.evaluate(() => window.scrollTo(0, 99999)); await p.waitForTimeout(300);
  await p.screenshot({path: 'v3_view3.png'});
  await b.close();
})();
