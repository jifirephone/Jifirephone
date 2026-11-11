# Voiceover v2 — iCloud unlock promo (iPhone 7 → 11 Pro Max), 2026-11-11

Owner asked for a better VO. Hook kept as the owner's own dictated wording
(«جهازك قافل آيكلود، وبعده ما فرمت؟ / لا تفرمته قبل لا تشوف هذا»); body improved,
range is iPhone 7 → iPhone 11 Pro Max. Kept honest (your own forgotten code) and
the reported-lost caveat stays.

Checks: voicecheck **PASS 97.3** · Iraqi 100% · 0 AI phrases · dialect 100% / 0 فصحى ·
beats ~24.5s, no beat > 4s, on target.

## ElevenLabs text (Ali Al Bazzaz, Multilingual v2 — stability 40-45%, similarity 75%, style 20-30%, speaker boost on)
```
جهازك قافل آيكلود، وبعده ما فرمت؟ <break time="0.5s" />
زين سويت، لا تفرمته قبل لا تشوف هذا. <break time="0.5s" />
من آيفون سبعة، لـ احدعش برو ماكس، <break time="0.3s" />
نخطيلك القفل، والخط يشتغل عدل. <break time="0.5s" />
بسرعة، وبسعر يريّحك. <break time="0.5s" />
بس انتبه، الجهاز المبلّغ عنه فقدان ما نشتغله. <break time="0.6s" />
جهازك مالك ونسيت الرمز؟ تعال لجي فاير. <break time="0.5s" />
جي فاير للموبايل، النجف، ميلاد، شارع الحولي.
```

Check on arrival (ElevenLabs sometimes swaps dialect for فصحى): «سبعة» = 7 and «احدعش» = 11
(not «واحد عشر»); first word stays «جهازك» (not «جهازكَ»/فصحى); «آيكلود» clear; «ما نشتغله» stays Iraqi.
Cut sentences only inside real silences (silencedetect −45 dB), no de-esser, keep the final «ماكس/فقدان/الحولي» whole.

## Scene mapping (unchanged timings, re-cut to the new take's pauses)
| line | footage | on screen |
|---|---|---|
| جهازك قافل آيكلود وبعده ما فرمت؟ | p1 locked | جهازك قافل آيكلود وبعده ما فرمت؟ |
| زين سويت، لا تفرمته قبل لا تشوف هذا | p1 | لا تفرمته! (red) |
| من آيفون سبعة لـ احدعش برو ماكس | p1 | من iPhone 7 لـ 11 Pro Max |
| نخطيلك القفل والخط يشتغل عدل | p2 flashing | نفتح القفل · والخط يشتغل |
| بسرعة وبسعر يريّحك | p2 | بسرعة وسعر مناسب |
| بس انتبه، المبلّغ عنه فقدان ما نشتغله | p2/p3 dim | full caution card |
| جهازك مالك ونسيت الرمز؟ تعال لجي فاير | p3 boot→home | صار شغّال! |
| جي فاير للموبايل، النجف، ميلاد، شارع الحولي | p4 home | address card → end card |
