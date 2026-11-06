# Ji Fire voice guide

How جي فاير للموبايل sounds, why, and what to do instead of the things models default to.
Read this before writing anything for the brand. The profile (who, what, links) is in
`brand/voice.md`; real samples are in `samples.md`.

## Contents
1. The voice in one paragraph
2. Ten rules (with the reason for each)
3. Before → after, by format
4. Word swaps

## 1. The voice in one paragraph

A shop owner from Najaf talking to a customer across the counter. Short sentences, often
without a verb. The number comes early and is said the way people say it («بعشرة الاف»،
«تلتالاف»، «مية وستين الف»). Device names in English (iPhone 15 Pro، Face ID، Swap),
everything else in Iraqi. Confident but not loud. No greetings, no "we are proud", no
"world of technology". Every line either gives a fact (price, warranty, what we fix) or
tells the viewer what to do. If a line could appear on any shop's page in any Arab country,
it is not Ji Fire yet.

## 2. Ten rules

1. **Say it the way it is said.** Scripts are read aloud by the owner. A فصحى sentence makes
   him stumble on camera and sounds like an ad agency. Iraqi only: شنو، شلون، اكو، ماكو، هواية،
   هسه، مو، وين، بس، خوش، شكد.
2. **Fact first.** Open on the number, the device or the problem, not on a greeting or a
   promise. «اربع خطوط بعشرة الاف.» beats «يسعدنا أن نقدم لكم عرضاً مميزاً».
3. **Numbers as spoken words in scripts, digits on screen.** He says «مية وستين الف»; the card
   shows «160,000». Captions can use digits.
4. **Never invent.** No price, warranty period, repair time, stock count or customer story that
   the owner didn't give. Use `{{السعر}}`، `{{مدة الضمان}}`، `{{وقت التصليح}}` and flag them, or
   write the line so it doesn't need the number («والسعر؟ يختلف حسب الموديل والعطل.»).
5. **No template phrases.** The lexicon in `scripts/ai_tells_ar.json` lists them: في عالم التقنية،
   نقدم لكم، لا تفوّت الفرصة، تجربة فريدة، بأسعار تنافسية، نحن هنا من أجلك… These are the
   strongest "AI wrote this" signal in Arabic marketing.
6. **Uneven rhythm.** Mix a three-word line with a ten-word one. Models write every sentence
   the same length; people don't. (An offer list is the exception, and that's fine.)
7. **One ask.** End with one thing: comment «السعر», come to the shop, or download the app.
   Not three.
8. **Few emoji, no emoji bullets.** Scripts: none. Captions, stories, DMs: up to three, never at
   the start of each line.
9. **Talk to one person.** «ايفونك»، «تريد»، «تدور»: second person singular, the way you'd
   talk to the customer in front of you. Avoid «عملاءنا الكرام».
10. **Short beats a list of adjectives.** «ترجع خوش مثل الجديدة» says more than «جودة عالية
    واحترافية ودقة».

## 3. Before → after

### Reel script line
- ✗ «في عالم التكنولوجيا المتسارع، نقدم لكم أفضل خدمات صيانة الآيفون بأعلى معايير الجودة.»
- ✓ «ايفونك طافي؟ لا ترميه، يتصلح.»

### Caption (first line survives the "... more" cut)
- ✗ «✨ اكتشف عالم العروض المذهلة مع جي فاير! 🔥 لا تفوت الفرصة واستمتع بتجربة تسوق فريدة 💯»
- ✓ «iPhone 15 Pro بالأقساط. اكتب «السعر» ونگلك التفاصيل.»

### Reply to a comment («بيش؟»)
- ✗ «مرحباً بك عزيزي العميل، يسعدنا تواصلك معنا! تم إرسال التفاصيل في الخاص.»
- ✓ «هلا بيك، دزيتلك السعر بالخاص.» _(only after the owner approved sending it)_

### DM (keyword «السعر»)
- ✗ «شكراً لاهتمامك بمنتجاتنا. يسرنا إبلاغك بأن سعر الجهاز هو...»
- ✓ «هلا حبيبي، الـ iPhone 15 Pro سعره {{السعر}}، وبالأقساط اكو {{شروط الأقساط}}. تحب نحجزلك واحد؟»

### Story
- ✗ «نحن هنا من أجلك على مدار الساعة لتلبية جميع احتياجاتك التقنية.»
- ✓ «شاشة مكسورة؟ دزلنا صورتها 📸 ونگلك شكد.»

## 4. Word swaps (فصحى / template → Iraqi)

| ✗ | ✓ |
|---|---|
| هل تبحث عن | تدور |
| يمكنك / تستطيع | تكدر |
| الآن | هسه |
| لماذا | ليش |
| ماذا | شنو |
| كيف | شلون |
| لدينا / نقدم لكم | عدنا |
| جداً | كلش / هواية |
| لا يوجد | ماكو |
| يوجد | اكو |
| أرسل لنا | دزلنا |
| سوف | راح |
| ليس | مو |
| لا تفوّت الفرصة | الحگ |
| بالإضافة إلى ذلك | وهم |
