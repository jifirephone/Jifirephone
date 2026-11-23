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
