# Brand & device showcase (light style), 2026-11-12
Owner: a different style that shows products, app, devices and brands (Samsung, iPhone, realme, Xiaomi, TECNO, Infinix, tablets, used),
plus code 25,000 + free delivery + «ضمان شهر مع وصل ضمان».
- Light cream/white style, black type, gold accents (first non-dark reel). `remotion/src/disc25/Showcase.tsx`, 31 s, music 110 BPM, −13.8 LUFS.
- All devices are in-stock catalog items read from Shopify on 2026-11-12; images are the store's own. No prices on screen.
- Brand names are plain text (no third-party logos). Used devices = the store's real photos.
- Offers: jifirecode 25,000 IQD, min 200,000 (verified ACTIVE); free delivery all Iraq (on site); 1-month warranty + receipt (owner-stated 2026-11-12;
  earlier app promo said «ضمان سنة» — which warranty applies to what is the owner's to confirm).
- Preview (no VO): `out/preview_showcase_brands.mp4`. VO script in `vo_script.txt` (voicecheck PASS).

## VO laid (2026-11-12)
Owner's ElevenLabs file (voice «Arafat Almnshid – Social media») holds the script twice; **take 2** (from 25.54 s) used:
«ألف» and «إنفنكس» clearer than take 1 (take 1's «الف» lost its ف, Whisper prob 0.01). Voice whole, onset 0.15 s.
Scenes cut on the words (STARTS in Showcase.tsx): one brand per spoken name (~0.6 s each, fast montage).
New discount scene: «وفوكاها / خصم 25,000 د.ع / بالكود» with each letter of «jifirecode» lighting up as it is spelled out.
Offer rows land on «وتوصيل مجاني» and «وضمان شهر». «جي فاير للموبايل» is said over the end card.
Final-audio Whisper: all 47 words present. Mix −14.0 LUFS. Final: `out/preview_showcase_brands_vo.mp4` (27.3 s).

## v2 (2026-11-12) — owner feedback
- Warranty (owner): **1 year for new devices, 1 month for used**, with a warranty receipt. Row now «ضمان سنة للجديد / وشهر للمستعمل · مع وصل ضمان».
  The VO said «وضمان شهر» for everything, so «شهر» was cut (at the «ش» onset, 46.875 s raw); the line now reads «وضمان، وصل ضمان».
- The «laugh»: the AI voice rendered «ويه» (before «وصل ضمان») as a laugh-like «وإيه»; removed (47.50–48.08 raw, between real silences).
- First brands were too fast: music-only pauses inserted at the real dips after آيفون (+0.8 s), سامسونج (+0.6), ريلمي (+0.3), شاومي (+0.3).
  iPhone now holds 1.5 s, Samsung 1.4 s. Cuts re-mapped (STARTS), SFX `sfx_cues_vo2.json`, 28.5 s, −13.9 LUFS.
- Final-audio Whisper: every remaining word present. Final: `out/preview_showcase_brands_vo2.mp4`.

## Reference-style version (2026-11-13)
Owner sent a reference reel (85 s, creator talking-head + motion panels) and asked to take its transitions, text and sounds.
Technique only, nothing copied (no footage, text, music or logo):
- dark teal blurred backdrop with drifting soft «+» shapes; frosted glass panel with window dots;
- word-by-word captions, active word in a filled box (brand **gold** instead of the reference's lime);
- stacked kinetic words (كل / الماركات / بمكان واحد; توصيل مجاني / لكل العراق / ضمان سنة للجديد / وشهر للمستعمل);
- typed pill «Ji Fire for Mobile» + badge; ring counter 0 → 25,000 on «خصم خمسة وعشرين ألف»; the code typed into an input field letter by letter as it is spelled;
- app card with a «حمّل» button that gets pressed (→ «تم ✓»), like the reference's follow card;
- zoom-blur transitions (8 frames) with a light sweep on section changes;
- sound: short airy whoosh on every cut (3 alternating types), ticks for the counter and each typed letter, chime on completion, pops on stacked words.
Same voice/timing as Showcase vo2. `remotion/src/disc25/ShowcaseRef.tsx`, captions `refCaps.json`, SFX `sfx_cues_refstyle.json`.
Final: `out/preview_showcase_refstyle.mp4` (28.5 s, −13.9 LUFS). The reference video itself is not committed.
