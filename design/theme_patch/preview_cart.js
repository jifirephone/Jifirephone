// open the unpublished theme «تيست سلة» in preview, fill a cart, screenshot, optionally inject a local CSS file
const {chromium, devices} = require('playwright');
const fs = require('fs');
const THEME = '190645207335';
const css = process.argv[2] ? fs.readFileSync(process.argv[2], 'utf8') : null;
const tag = process.argv[3] || 'before';
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({...devices['iPhone 13'], locale: 'ar-IQ', deviceScaleFactor: 2});
  const p = await ctx.newPage();
  await p.goto(`https://jifirephone.com/?preview_theme_id=${THEME}`, {waitUntil: 'domcontentloaded', timeout: 60000});
  const add = async (handle, qty = 1, pick = (v) => v.available) => {
    const prod = await p.evaluate(async (h) => (await fetch(`/products/${h}.js`)).json(), handle);
    const v = prod.variants.find(pick) || prod.variants[0];
    await p.evaluate(async ({id, qty}) => fetch('/cart/add.js', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({items: [{id, quantity: qty}]})}), {id: v.id, qty});
    return v.title;
  };
  console.log(await add('18-pro-max', 1, (v) => v.available && /فعلية/.test(v.title)));
  console.log(await add('samsung-65w-wall-charger', 1));
  await p.goto(`https://jifirephone.com/cart?preview_theme_id=${THEME}`, {waitUntil: 'domcontentloaded'});
  await p.waitForTimeout(5000);
  if (css) { await p.addStyleTag({content: css}); await p.waitForTimeout(800); }
  await p.evaluate(() => document.querySelectorAll('[class*="preview-bar"], #preview-bar-iframe, #PBarNextFrameWrapper').forEach((e) => e.remove()));
  await p.screenshot({path: `work/cartfix/${tag}_full.png`, fullPage: true});
  if (tag === 'before') {
    const tree = await p.evaluate(() => { const m = document.querySelector('#main-cart') || document.body; const out = [];
      const walk = (el, d) => { if (d > 9) return; for (const c of el.children) { const cls = (c.className && c.className.baseVal === undefined ? c.className : '') || '';
        if (cls || c.id) out.push('  '.repeat(d) + c.tagName.toLowerCase() + (c.id ? '#' + c.id : '') + (cls ? '.' + cls.trim().split(/\s+/).join('.') : ''));
        walk(c, d + 1); } }; walk(m, 0); return out.join('\n'); });
    fs.writeFileSync('work/cartfix/dom.txt', tree);
  }
  await b.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
