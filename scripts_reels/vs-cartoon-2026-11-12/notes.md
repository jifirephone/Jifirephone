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
