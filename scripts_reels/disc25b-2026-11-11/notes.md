# Pick-a-phone + discount reel (2026-11-11)

Owner brief: enter the site, show the customer choosing **HONOR X9e Pro**, then **POCO F9 Ultra**,
apply the discount, with on-screen text and a voiceover.

## Verified from the store (read-only, not invented)
- **HONOR X9e Pro 5G** — ACTIVE, from **639,000 د.ع** (8GB), 759,000 (12GB). Specs from tags: 108MP, 11000mAh, AMOLED 120Hz, 5G. In stock.
- **POCO F9 Ultra 5G** — ACTIVE, **1,425,000 د.ع**. ⚠️ currently **out of stock (0)** — owner should confirm before publishing.
- Code the owner wrote «jifirephone» does **not exist**. The real active code is **jifirecode**
  (25,000 د.ع off, min 200,000, no expiry). Used jifirecode in the video.
- Free delivery for all Iraq provinces is shown on the site (product page), so it's confirmed, not just stated.

## Video
`remotion/src/disc25/Disc25b.tsx`, 29.8 s, 9 scenes: hook → browse the real site (phone frame + tap)
→ HONOR X9e Pro card → POCO F9 Ultra card → code jifirecode → «تم تطبيق الكود / خصم 25,000 / توصيل مجاني لكل العراق»
→ note (أقل فاتورة 200,000) → CTA (التطبيق/الموقع) → end card. Varied transitions + soft SFX, music −13.9 LUFS.
Captions on-screen. Preview (music only, no VO yet): `out/preview_disc25b_select_offer.mp4`.

## Voiceover — ElevenLabs text (Ali Al Bazzaz; voicecheck PASS 97.5, Iraqi 100%, 0 AI, dialect 100%)
```
تدور موبايل جديد وبسعر يعجبك؟ <break time="0.5s" />
ادخل موقع جي فاير. <break time="0.4s" />
اختار اللي تريده: هونر X9e Pro، بطارية ضخمة وكاميرا قوية. <break time="0.5s" />
أو POCO F9 Ultra. <break time="0.5s" />
وقت الطلب، حط كود jifirecode. <break time="0.5s" />
ويتخصم خمسة وعشرين الف، والتوصيل مجاني لكل العراق. <break time="0.5s" />
بس خلي فاتورتك مئتين الف وفوك. <break time="0.5s" />
جي فاير للموبايل، اطلب هسه من الموقع او التطبيق.
```
Check on arrival: «جي فاير» not «جيفايل»; «هونر» / «بوكو» clear; «jifirecode» read as the English letters
or spelled out (either is fine on screen); numbers «خمسة وعشرين الف» and «مئتين الف» correct; no فصحى
(first word stays «تدور»). Cut sentences only inside real silences, no de-esser, keep word-final fricatives.
When the take arrives I re-time the 8 scenes to it and lay music/SFX under it (final −14 LUFS).
