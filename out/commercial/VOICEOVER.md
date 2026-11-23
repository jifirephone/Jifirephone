# Voice-over — ElevenLabs (owner generates; not generated here)
Voice: male Iraqi, energetic and confident commercial tone (previous takes: "Ali Al Bazzaz – Iraqi Narration/Commercials").
Settings that worked: Multilingual v2, stability 40–45 %, similarity 75 %, style 20–30 %, speaker boost on.
voicecheck: PASS 100 · Iraqi 100 % · 0 AI phrases (owner's «بكل سهولة» flagged as a template phrase → «واطلبه بكبسة زر»).

Paste as ONE take (the breaks place each line in its scene):
```
تدور على موبايل جديد؟ وتريد تتسوق براحتك؟ <break time="1.0s" />
بجي فاير للموبايل، تلكه عالم من الموبايلات والأجهزة والإكسسوارات! <break time="1.5s" />
وحتى المستعمل، تفاصيل الجهاز واضحة إلك قبل لا تشتري! <break time="1.5s" />
ومن مكانك، افتح موقعنا أو تطبيق جي فاير، اختار جهازك واطلبه بكبسة زر! <break time="1.5s" />
وين ما تكون بالعراق، جي فاير يوفرلك التوصيل لجميع المحافظات، وهدفنا يوصلك طلبك بأسرع وقت! <break time="1.5s" />
جي فاير للموبايل... عالم الأجهزة بين إيديك! تصفح، اختار، واطلب هسه!
```

| Line | Target window | Scene |
|---|---|---|
| 1 | 0.6–4.6 s | logo forge |
| 2 | 5.6–10.8 s | device world |
| 3 | 15.6–21.0 s | used device |
| 4 | 23.6–30.6 s | site & app |
| 5 | 33.6–41.0 s | delivery |
| 6 | 44.0–50.5 s | finale |

When the take arrives: cut it into the six lines inside real silences, place each line at its window (picture is not re-cut),
update `vo[].t/end` in `remotion/src/commercial/config.json` to the real word times, re-render, then mix:
voice + music ducked (sidechain) + SFX → −14 LUFS for `jifire_commercial_final.mp4`, and voice + SFX (no music) for the no-music version.
Check on arrival: «تدور» not «تبحث», «تلكه», «إلك», «هسه» stay Iraqi; «جي فاير» clear; nothing rendered as a laugh.
