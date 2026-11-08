# Ji Fire explainer (cartoon close to reality), started 2026-11-08
Owner brief: a cartoon explainer like the TikTok reference (refs/ref4_tiktok.mp4, gitignored, technique only): Ji Fire gives
high-quality service at a fair price, has an app where you can order anything, cash and instalments, delivery to the door;
use the real storefront photo (brand/storefront.jpg); movements, tidy transitions and transition sounds; voiceover.

Reference technique: 2D story cartoon, one simple character, signs/boards popping with keywords and numbers, camera push on
every sentence, word-by-word caption (white, black outline) low in frame, Iraqi narration ~3 words/s.
Our version: original character «حيدر» (`remotion/src/explainer/Toon.tsx`), the real storefront cartoonised with OpenCV
(bilateral + k-means 18 colours + thin Canny ink, lit signs kept from the photo), brand black/gold boards, logo bug, end card.

Script checks: hook «موبايل بالقسط، ويوصلك لباب البيت؟» 75.5 STRONG; voicecheck 97.6 PASS (Iraqi); beats 30.7 s, loop on «موبايل بالقسط».
«جودة عالية» is flagged by voicecheck as an AI phrase, so it goes on screen only; the voice says «شغلهم نظيف، وسعرهم مناسب».

## Scenes (≈ 34 s)
| VO | picture |
|---|---|
| موبايل بالقسط، ويوصلك لباب البيت؟ | board pops: «أقساط» + «توصيل للبيت», phone + house icons |
| خلينا نقول حيدر يريد موبايل جديد. | Haidar at home, old cracked phone, thought bubble with a new phone |
| بس الفلوس ما تكفي كاش. | wallet opens, a few notes fall, worried face |
| راح لجي فاير للموبايل بالنجف. | walk → cartoon storefront (real shop), camera pushes to the sign |
| بالمحل اكو أجهزة، اكسسوارات، صيانة، وخطوط. | four icons pop on the facade, one per word |
| وشغلهم نظيف، وسعرهم مناسب. | board «جودة عالية • سعر مناسب» with a gold tick |
| حيدر أخذ موبايله بالقسط. | counter scene, board «قسط», Haidar happy with the new phone |
| وصديقه علي أخذ مالته نقد. | friend Ali (second character) pays cash, board «نقد» |
| والأحلى؟ عدهم تطبيق، تطلب منه أي شي. | big phone with the app UI, items fly into the cart |
| ويوصلك لباب البيت. | delivery scooter rides across, stops at a house door, box handed over |
| جي فاير للموبايل، النجف، ميلاد، شارع الحولي. | storefront wide + address card with pin |
| تريد موبايل بالقسط؟ اكتب السعر بالتعليقات. | end card (logo, tagline, «اكتب السعر بالتعليقات») |

## v1 preview (owner's ElevenLabs take, 39.3 s) — `out/preview_explainer.mp4` (42.6 s, −14.5 LUFS)
Owner changed lines in the take: Ali buys «iPhone 18 Pro Max نقد»; ending «تفضل زورنا أو اطلب من خلال تطبيقنا، ومباشر ثاني يوم يوصلك لباب بيتك»
(next-day delivery is the owner's own claim). Composition `remotion/src/explainer/Explainer.tsx`, 14 scenes cut in the VO's real pauses,
captions from `captions.json` (Whisper words, spelling fixed), SFX `sfx_cues.json` (each transition type has its own sound), music 100 BPM.
