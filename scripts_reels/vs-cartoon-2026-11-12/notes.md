# Cartoon social explainer — traditional shopping vs e-commerce (2026-11-12)

Owner brief: cartoon video showing the problems of traditional shopping (traffic, heat,
crowds, waiting) vs e-commerce (one button on OUR site → delivered to your door, free delivery);
one tap inside our site, apply a discount code **if available**, buy what you like.

Own SVG cast (Person from Toon.tsx). No invented offer: the discount step is generic
(«إذا أكو كود خصم، يتطبّق») — no specific code/price claimed. Free delivery for all Iraq
provinces is shown on the site, so it's accurate.

Video (33s, 11 scenes): title (hot day, sweating) → traffic + heat → crowded shop/waiting →
«أكو حل أحسن!» → home relaxed with phone → one tap on our site (phone + glowing «اشترِ الآن»)
→ «إذا أكو كود خصم يتطبّق» → scooter to the door → «توصيل مجاني لكل محافظات العراق» → CTA → end card.
Soft cartoon SFX + music bed −13.8 LUFS. On-screen captions. `remotion/src/explainer/VsReel.tsx`.
Preview (music only, VO optional): `out/preview_vs_cartoon.mp4`.

## Voiceover — ElevenLabs text (Ali Al Bazzaz; voicecheck PASS 99.0, Iraqi 100%, 0 AI)
```
التسوق التقليدي؟ زحمة وحر وانتظار. <break time="0.5s" />
تروح للمحل، تدز، وتنطر دورك. <break time="0.5s" />
بس أكو حل أحسن! <break time="0.5s" />
بالبيت ومرتاح، تفتح موقع جي فاير. <break time="0.4s" />
تختار اللي يعجبك، وبكبسة زر تشتري. <break time="0.5s" />
وإذا أكو كود خصم، يتطبق ويطيح السعر. <break time="0.5s" />
ويوصلك لباب بيتك، بتوصيل مجاني لكل العراق. <break time="0.5s" />
جي فاير للموبايل، تسوق بكل راحة من الموقع او التطبيق.
```
When the take arrives: re-time scenes to it, lay music/SFX under (final −14 LUFS), Whisper-verify.

## v2 (2026-11-12) — owner feedback
- In-app display rebuilt as a clean app screen (not a screenshot): real HONOR X9e Pro image, «يبدأ من 639,000 د.ع» (store reading),
  chips, free-delivery strip, glowing «اشترِ الآن» with tap ripple; phone 30% larger.
- New «إتمام الطلب» scene: order summary, 3 checked steps (السلة / عنوان التوصيل / التوصيل مجاني), «تم الطلب بنجاح».
- Scooter replaced by a full Ji Fire delivery van (black box, gold cabin, logo, «توصيل مجاني لباب البيت», spinning wheels), daytime street, box at the door.
- 12 scenes, 34.9 s, SFX `work/vsreel/cues3.json`, −14 LUFS. Final preview `out/preview_vs_cartoon_v2.mp4`.

## VO laid (2026-11-12)
Owner sent two ElevenLabs takes of his own edited script («تروح للمحلات، تفتر، وتنطر دورك، ويمكن ما تحصل تريده… تفتح تطبيق جي فاير للموبايل…»).
Near-identical; take 1 (906f40d5) used (cleaner «وانتظار»). Voice runs whole; one 2.4 s music-only pause inserted in the real silence
at 20.08 s for the order scene. Scenes re-timed to the voice (DUR in VsReel.tsx), captions matched to the spoken words
(«تفتر وتنطر دورك», «لباب بيتك»). Final-audio Whisper: 55/55 words, no فصحى. Mix −14.1 LUFS.
Final: `out/preview_vs_cartoon_vo.mp4` (34.3 s). SFX `work/vsvo/cues.json`.
