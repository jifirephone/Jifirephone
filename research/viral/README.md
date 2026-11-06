# Viral research: Iraqi phone shops (Ji Fire for Mobile)

**Status 2026-11-06: HYPOTHESES ONLY, no evidence yet.**
Instagram, TikTok and YouTube are blocked from this cloud environment, so no view counts or account
medians could be read. Nothing here is "what is going viral"; it is what to test. `~/.claude/instagram/swipe.md`
has deliberately NOT been written, so `/ig-reel` and `/ig-plan` don't treat these guesses as evidence.

## Hypotheses (hook shapes common in phone-shop reels, Ji Fire versions, scored with patched hookscore.py)
See `hypotheses.tsv` and `scored.json`.

| id | score | formula | Ji Fire hook |
|---|---|---|---|
| H10 | 92.0 STRONG | #20 Permission | ما تحتاج Pro Max حتى تصور خوش. |
| H3 | 81.9 STRONG | #13 Before And After | شاشة ايفونك هيج صارت؟ شوف شلون رجعت. |
| H4 | 81.2 STRONG | #2 Negative Command | لا تشتري ايفون مستعمل قبل ما تفحص هالشغلة. |
| H8 | 76.1 STRONG | #17 Head To Head | iPhone 13 لو 15؟ الفرق مو مثل ما تتصور. |
| H5 | 74.5 STRONG | #11 Numbered | تلث شغلات افحصها بالمستعمل، الثالثة محد ينتبهلها. |
| H1 | 73.1 STRONG | #24 Reveal (guess the price) | بكم تتوقع هذا الـ iPhone 15 Pro؟ اكتبها بالتعليقات. |
| H6 | 61.6 OK | #16 Verbatim Question | «اكو أقساط بدون مقدمة؟» هالسؤال يجينا كل يوم. |
| H7 | 60.0 OK | #8 Insider Leak | شلون ينغشون الناس بالايفون المستعمل؟ احجيلكم. |
| H9 | 57.0 OK | #25 Someone Else's Result | زبون جابلنا ايفون طافي، وطلع بس البورد. |
| H2 | 46.4 WEAK | #17 Head To Head | أصلي لو تقليد؟ فرق الشاشة يبين بثانية. |

hookscore measures the text only (AUC 1.00 on our own 16 labelled Arabic hooks, a small and self-made set).
It cannot tell which of two decent hooks will travel. Only the outlier data below can.

## To turn this into evidence
1. Owner picks 6–12 accounts: 4 Iraqi phone shops slightly ahead, 4 adjacent (Iraqi tech/review/unboxing),
   2–4 big ones for format only, plus the owner's own **Saved** collection.
2. For ~12 reels per account fill `captured.tsv` (account, followers, median of the last 12, views, hook verbatim,
   on-screen, length, cta). Either the owner pastes it, or a browser on the owner's own computer is connected.
   Never log in for them, never scrape.
3. `python3 ~/.claude/skills/ig-viral/swipe.py captured.tsv --out ~/.claude/instagram/swipe.md`
   ranks by outlier multiple (views ÷ account median; > 3x = signal).
