# Update 2026-11-11 — device range changed to iPhone 7 → iPhone 11 Pro Max

Owner: the unlock promo («جهازك قافل آيكلود وبعده ما فرمت؟ / لا تفرمته قبل لا تشوف الفيديو هذا»)
should state the serviced range as **iPhone 7 → iPhone 11 Pro Max**, not 17 Pro Max.

Changes made:
- On-screen text (scene 3) `X17Reel.tsx`: «من iPhone X لـ 17 Pro Max» → «من iPhone 7 لـ 11 Pro Max».
- The recorded ElevenLabs VO says «من آيفون اكس، للسبعطعش برو ماكس» (5.25–8.28 s), which now
  contradicts the screen. Per the rule (never ship a VO that differs from the screen), that one
  spoken sentence is **muted** in the voice stem; music/SFX bed continues, so timing/scene cuts
  are unchanged. Preview: `out/preview_x17_unlock_7to11.mp4`.

To have the range **spoken** again, regenerate ONE ElevenLabs line (same voice, Ali Al Bazzaz) and send it:

```
من آيفون سبعة، لـ احدعش برو ماكس.
```

(سبعة = 7, احدعش = 11). It will be spliced into the 5.25–8.28 s gap (cut inside the real silences,
no de-esser, keep the final «ماكس» whole) and the mix re-mastered to −14.8 LUFS.
