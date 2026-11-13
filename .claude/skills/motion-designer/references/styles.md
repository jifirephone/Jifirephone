# Style catalog (all in remotion/src unless noted)

| Style | Composition | Key techniques |
|---|---|---|
| Dark luxury offer | `disc25/Disc25.tsx` | gold radial bg, floating coins, badge springs, coupon ticket with shine, varied enter (slide/blur-scale/drop/wipe) |
| Pick-a-phone flow | `disc25/Disc25b.tsx` | real site in a phone frame + tap marker, product cards from catalog, code → «تم تطبيق الكود» |
| Light brand showcase | `disc25/Showcase.tsx` | cream bg, brand title + device cards per brand, used-photo grid, app grid scroll, offer rows, code letters light up as spelled |
| Reference style: teal glass panel | `disc25/ShowcaseRef.tsx` + `refCaps.json` | blurred teal backdrop, frosted panel, word-by-word captions with boxed active word, stacked kinetic words, ring counter, typed input, pressed app button, zoom-blur + light sweep |
| Kinetic typography | `disc25/TypeReel.tsx` | scramble, letters assemble, word cycle, strike-through, kashida stretch, font-weight ramp 200→1000, typed highlight block, **stamp «مضمون»**, echo stack, **morph «حمّل التطبيق» → «جي فاير للموبايل»**, brand card |
| Beat-cut storefront | `disc25/StoreBeat.tsx` + `scripts/make_beat.py` | storefront photo punch-zooms on the beat, zoom-through door + flash, whip pans, object fly-wipe, route map, stamp |
| Cartoon explainer | `explainer/VsReel.tsx`, `explainer/Toon.tsx` | SVG cast (Person moods), traffic/heat/crowd, clean app screen, order steps, Ji Fire delivery van |
| Repair (landscape footage) | `conv/ConvReel.tsx`, `scripts/make_segments.py --layout panel` | 4:5 panel over blur, headlines above panel |
| Unlock (vertical footage) | `x17/X17Reel.tsx` | caution card, cuts in VO pauses |

## Ideas proposed, not built yet (owner liked the reference)
Exploded phone (repair layers), isometric Najaf map + route / Iraq map to all provinces, line-drawing stick figure,
dot drawing order steps, site search bar typing results, isometric shop building with info chips, counter + chart (needs real numbers),
split screen with the owner talking (needs footage).

## Assets
- Catalog images: `remotion/public/show/` (in-stock items, 2026-11-12), `remotion/public/disc25b/` (HONOR X9e Pro, POCO F9 Ultra).
- Site: `remotion/public/type/site.jpg` (phone-viewport capture), storefront `brand/storefront.jpg` → `public/type/store.jpg`.
- Logo `remotion/public/logo.png`; fonts loaded once in Root (`loadBrandFonts`).
- Stills/posts: `design/banner/*.html` + Playwright `p.goto('file://'+cwd+'/x.html')` (setContent breaks relative URLs).
