# Offer reel, 2026-11-07 (34.3 s, 1080x1920)

**Offer (given by the owner on 2026-11-07, current):** iPhone 17 Pro Max, iPhone 18 Pro Max, Galaxy S26 Ultra at the best market
price; discount code 25,000 IQD (the app shows code `j2026`, countdown ending 10/11 00:00); free delivery to the door;
warranty + warranty receipt; ends in 2 days; download the app from Google Play / App Store.
**Treat as historical after 10/11.**

Footage: the owner's own app screen recordings (`work/offer/app1.mp4`, `app2.mp4`, not committed). Clips cut to
`remotion/public/offer/` (886x1816, Android bar removed). Structure learned from a reference reel (technique only).

| s | scene | transition in | sound |
|---|---|---|---|
| 0–4 | hook: «تريد iPhone 17 أو 18 / أو Galaxy S26 Ultra؟» + «بأنسب سعر بالسوق» | – | bloom |
| 4–8 | two phones: 17 Pro Max + 18 Pro Max pages | slide | swish |
| 8–12.3 | discount code: zoom on j2026, tap on «استخدام كود الخصم», ✓ | zoom-in | riser, tick, chime |
| 12.3–15.7 | free delivery to the door, all governorates | whip | low swish |
| 15.7–19.2 | warranty + warranty receipt cards | blur | bloom |
| 19.2–22.5 | Galaxy S26 Ultra in the app | iris | chime |
| 22.5–26.7 | ends in 2 days (live countdown) + «يلا الحگ قبل لا تصعد الأسعار!» | dolly-out | shimmer + ticks |
| 26.7–31 | download the app (picker screen, store chips, link) | push-up | swish |
| 31–34.3 | logo end card | fade to black | pad swell |

Composition: `remotion/src/offer/OfferPromo.tsx`. Music: `make_music.py 34.34 120`. SFX: `make_sfx.py sfx_cues.json`.
Mix −14.6 LUFS. Export: `out/jifire_offer_iphone17-18_s26.mp4`.

## v2 (Shopify data, layered motion graphics), `out/jifire_offer_v2_shopify.mp4` (37 s)
Owner correction: no raw screen recordings. Built from the store's own data and product images (Shopify connector,
`shopify_verified.json`): cut-out product heroes in 3D, prices counting to the physical-SIM prices, a rebuilt discount
ticket (j2026 typed, 25,000 counting, copy tap, terms: once per customer, orders over 200k), delivery path, warranty cards,
countdown to 10/11 00:00, app CTA, logo. 10 different transitions with their own sounds (`sfx_cues_v2.json`).
Composition `remotion/src/offer/ShopPromo.tsx`. Render ≈ 4 min (product images kept ≤ 820 px, no per-frame filters on photos).

## v3 (ElevenLabs voiceover), preview `work/shop/preview_v3_vo.mp4` (40.2 s)
iPhone 17 Pro Max → «يبدي من 1,950,000» (owner). Scenes re-timed so each VO sentence starts 0.33 s into its scene;
SFX `sfx_cues_v3.json`; music `make_music.py 40.167 120`; voice light AI chain, music+SFX sidechain-ducked, mix −14.7 LUFS.
VO line 2 trimmed to «ايفون 17 Pro Max» (recorded price 2,100,000 is outdated); waiting for a regenerated line.
