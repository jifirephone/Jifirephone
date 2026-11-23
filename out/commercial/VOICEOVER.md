# Voice-over — ElevenLabs (owner generates; not generated here)
Voice: male Iraqi, energetic and confident commercial tone (previous takes: "Ali Al Bazzaz – Iraqi Narration/Commercials").
Settings that worked: Multilingual v2, stability 40–45 %, similarity 75 %, style 20–30 %, speaker boost on.
voicecheck: PASS 100 · Iraqi 100 % · 0 AI phrases (owner's «بكل سهولة» flagged as a template phrase → «واطلبه بكبسة زر»).

Paste as ONE take (the breaks are the pauses between scenes; each line is then placed on its window):
```
تدور على موبايل جديد؟ وتريد تتسوق براحتك؟ <break time="1.0s" />
بجي فاير للموبايل، تلكه عالم من الموبايلات والأجهزة والإكسسوارات! <break time="1.0s" />
جديد ومستعمل، وكل الماركات. <break time="1.0s" />
وحتى المستعمل، تفاصيل الجهاز واضحة إلك قبل لا تشتري! <break time="1.0s" />
ومن مكانك، افتح موقعنا أو تطبيق جي فاير، اختار جهازك واطلبه بكبسة زر! <break time="1.0s" />
وين ما تكون بالعراق، جي فاير يوفرلك التوصيل لجميع المحافظات، وهدفنا يوصلك طلبك بأسرع وقت! <break time="1.0s" />
جي فاير للموبايل... عالم الأجهزة بين إيديك! تصفح، اختار، واطلب هسه!
```

| Line | Window | Est. at 140 wpm | Scene |
|---|---|---|---|
| 1 | 0.6–4.6 s (4.0) | 3.4 s | logo forge |
| 2 | 5.6–10.8 s (5.2) | 4.2 s | device world |
| 3 (new) | 12.2–14.8 s (2.6) | 2.0 s | brand cloud «أجهزة جديدة ومستعملة» |
| 4 | 15.6–21.0 s (5.4) | 4.2 s | used device |
| 5 | 23.6–30.6 s (7.0) | 6.0 s | site & app |
| 6 | 33.6–41.0 s (7.4) | 6.8 s | delivery |
| 7 | 44.0–50.5 s (6.5) | 5.9 s | finale |
voicecheck: PASS 100 · Iraqi 100 %. If the take comes out faster than ~140 wpm everything still fits; slower than ~125 wpm makes line 6 tight
(then ask ElevenLabs for slightly faster delivery, or I trim the pause before «وهدفنا»).

When the take arrives: cut it into the six lines inside real silences, place each line at its window (picture is not re-cut),
update `vo[].t/end` in `remotion/src/commercial/config.json` to the real word times, re-render, then mix:
voice + music ducked (sidechain) + SFX → −14 LUFS for `jifire_commercial_final.mp4`, and voice + SFX (no music) for the no-music version.
Check on arrival: «تدور» not «تبحث», «تلكه», «إلك», «هسه» stay Iraqi; «جي فاير» clear; nothing rendered as a laugh.


---
## v2 — continuous read, no cutting (2026-11-24)
ElevenLabs ignores `<break>` tags, so v1 had to be split. v2 is written to be read **in one go**: each scene's text is sized to the
scene's length at this voice's measured pace (70 words / 33.6 s ≈ 2.08 words/s), so the lines land on their scenes by themselves.
Generate with **Speed 0.95** (simulated: every line starts within ±0.3 s of its scene). The device names in line 2 follow the
carousel order (one per second). 105 words, voicecheck PASS 100, Iraqi 100 %.
```
تدور على موبايل جديد؟ وتريد تتسوق وانت مرتاح؟
بجي فاير، تلكه ايفون ثمنطعش برو ماكس، وسبعطعش برو ماكس، وسامسونج، وريدمي، وبوكو، وريلمي، وتكنو، وانفنكس، وكل الماركات، جديد ومستعمل.
وحتى الأجهزة المستعملة، تشوف الذاكرة، والبطارية، والحالة، والملحقات، والسعر، كلشي واضح قدامك قبل لا تشتري.
ومن مكانك، ادخل موقع جي فاير أو حمّل التطبيق مالتنا، اختار الجهاز اللي يعجبك، وكمّل طلبك بكبسة زر وحدة.
وين ما تكون بالعراق، احنا نوصلك لكل المحافظات، والتوصيل مجاني للطلبات المشمولة، وهدفنا يوصلك طلبك بأقل من أربعة وعشرين ساعة.
جي فاير للموبايل... عالم الأجهزة بين إيديك. تلكانا بالنجف، شارع الحولي، أو اطلب من الموقع والتطبيق. تصفح، اختار، واطلب هسه!
```
| Scene | Picture | Line lands (sim.) |
|---|---|---|
| 0–5 | logo | 0.5–4.5 |
| 5–15 | 18 Pro Max → 17 Pro Max → Samsung → Redmi → POCO → realme → TECNO → Infinix → brands | 4.8–14.9 |
| 15–23 | used device cards | 15.2–22.8 |
| 23–33 | site → app → checkout | 23.0–32.6 |
| 33–43 | map → delivery | 32.9–43.0 |
| 43–55 | logo orbit → address & links | 43.2–54.9 |
On arrival: the whole take is laid as one piece from 0.5 s (only a uniform speed nudge if the total length is off), captions re-timed to the words.
