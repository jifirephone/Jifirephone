# Cart white & gold — applied to the unpublished theme «تيست سلة» (2026-11-09)
Owner: «ابيض وذهبي، اي عدّل على تيست سلة اريدها احترافي». Theme id gid://shopify/OnlineStoreTheme/190645207335 (UNPUBLISHED).
The live theme «ثيم اصلي» (MAIN) was not touched.

Files written (themeFilesUpsert, read back, checksums match):
- `assets/jifire-cart-white-gold.css` (new, md5 67608677c9fd3f1cdb8404abc428970f) = `assets/jifire-cart-white-gold.min.css` here
- `assets/jifire-cart-qty.css` (was md5 714cb06d…, now 6c49e75f…): one `@import url("jifire-cart-white-gold.css");` line added on top.
`sections/main-cart.liquid` unchanged (md5 407e573a…). Originals saved in `design/theme_backup/test-sala-2026-11-09/`.

Why it wins: every rule is scoped `html body.cart-template #main-cart …` (one more element than the older cart files),
so it overrides the blue/champagne layers without editing them. Colours, borders, radii and shadows only.
Undo: put back the original `jifire-cart-qty.css` (backup folder) or delete its first line.
Preview: https://jifirephone.com/cart?preview_theme_id=190645207335 ; `node design/theme_patch/preview_cart.js` fills a test cart and screenshots it.

## Switched to blue (2026-11-09, owner: «غير الالوان لنجرب الازرق»)
- `assets/jifire-cart-white-blue.css` (new, md5 233458415cf536745fdf2799f1cfb14d): same rules, site blue #1F6FD1, white text on blue fills.
- `assets/jifire-cart-qty.css` now imports the blue file (md5 448249d48449106eb3f3fd7c6cc45f07; local copy `jifire-cart-qty.blue.css`).
- The gold file stays on the theme. Back to gold = change the import line to `jifire-cart-white-gold.css` (local `jifire-cart-qty.css`).
Test note: the cart's stylesheets load in <body>, so a local test style must be appended to the end of <body> (preview_cart.js does this).
