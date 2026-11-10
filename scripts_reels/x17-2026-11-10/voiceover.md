# Voiceover: iCloud/passcode unlock promo (X → 17 Pro Max), written 2026-11-10
Owner brief: strong hook «عندك آيفون ناسي الحساب وبعده ما فرمت» / «لا تفرمت قبل لا تشوف الفيديو»; forgot iCloud, not formatted;
there is an unlock service with the line (signal) working; good price; **NOTE: reported-lost devices are not serviced**; VO; Najaf address; on-screen text.
Kept honest: the whole promo is framed as *your own* forgotten passcode/iCloud, never stolen devices, and the owner's
reported-lost disclaimer is a full-screen caution card (scene 6). hook «لا تفرمت آيفونك قبل لا تشوف هذا!» 79.5 STRONG; voicecheck 96.6 PASS, Iraqi 100%.

## ElevenLabs text (Ali Al Bazzaz, Multilingual v2, stability 40-45%, similarity 75%, style 20-30%, speaker boost on)
```
عندك آيفون، وناسي رمز الآيكلاود؟ <break time="0.5s" />
لا تفرمت جهازك، قبل لا تشوف هذا! <break time="0.6s" />
من آيفون اكس، لل سبعطعش برو ماكس. <break time="0.5s" />
إحنا نخطيلك القفل، والخط يشتغل عادي. <break time="0.5s" />
بسرعة، وبسعر مناسب. <break time="0.5s" />
ملاحظة مهمة: الأجهزة المبلّغ عنها فقدان، ما نشتغلها. <break time="0.6s" />
جي فاير للموبايل، النجف، ميلاد، شارع الحولي. <break time="0.5s" />
ناسي رمز الآيكلاود؟ لا تفرمت، تعال لجي فاير.
```
Check when it lands: «الآيكلاود» clear, «اكس» and «سبعطعش» come out Iraqi (not فصحى), no word swapped.

## Scenes (video seconds, provisional — re-timed to the VO's real pauses)
| VO | footage (inbox/x17-2026-11-10 → public/x17) | on screen |
|---|---|---|
| عندك آيفون وناسي رمز الآيكلاود؟ | p1 locked «iPhone غير متوفر» | آيفونك مقفل؟ |
| لا تفرمت جهازك قبل لا تشوف هذا! | p1 lockout | لا تفرمت جهازك! (red) |
| من آيفون X لل 17 Pro Max | p1 | من iPhone X لـ 17 Pro Max |
| نخطيلك القفل، والخط يشتغل عادي | p2 flashing on the box | نفتح القفل • والخط يشتغل عادي (signal) |
| بسرعة وسعر مناسب | p2 | بسرعة وسعر مناسب |
| ملاحظة مهمة: المبلّغ عنها فقدان ما نشتغلها | p2/p3 dimmed | full caution card |
| جي فاير، النجف ميلاد شارع الحولي | p3 boot → home (reveal) | صار شغّال! + address card |
| ناسي رمز iCloud؟ تعال لجي فاير | p4 working home | CTA → end card |

Composition `remotion/src/x17/X17Reel.tsx`; graded clips in `remotion/public/x17/` (gitignored). Draft (silent + music/SFX bed) `out/preview_x17_draft.mp4`.
