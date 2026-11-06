# Ji Fire for Mobile — Reel Editor Rules

> Claude: read this whole file at the start of EVERY session before touching a clip.
> Every time the user corrects you, add the correction to **Corrections log** below (dated), and follow it from then on.

## Client
- **Brand:** Ji Fire for Mobile — جي فاير للموبايل
- **Niche:** Smartphones (new & used), accessories, tech reviews, unboxing, product promotions, installment offers (أقساط), and ads for the Ji Fire for Mobile store + shopping app.
- **Audience:** Iraqi customers across Iraq, especially Najaf (النجف). They care about competitive prices, warranty (ضمان), installments and online shopping.
- **Language:** Natural Iraqi Arabic (اللهجة العراقية). Product names and tech terms stay in **English** (iPhone 16 Pro Max, Galaxy S25 Ultra, 5G, GB, mAh, Snapdragon, AMOLED, …). Never translate them or write them in Arabic letters, and never rewrite Iraqi dialect into MSA (فصحى).

## Footage
- Vertical talking-head reels shot on a phone, with the creator reading a script off a tablet.
- Raw clips go into `inbox/`. Finished reels go into `out/`. Scratch files go into `work/` (gitignored).

## Edit rules (step 3)
1. Transcribe with faster-whisper (`large-v3`, `language="ar"`, `word_timestamps=True`).
2. Cut silences, stutters, retakes and every glance at the script/tablet (MediaPipe face/gaze check).
3. **Never cut a word the creator says in the final take.** Cuts happen only between words, and each cut keeps a small padding around them.
4. If a line is retaken, keep the **last** complete take.
5. Hook in the first 3 seconds: **«تدور موبايل بأفضل سعر وأقوى ضمان؟ شوف عروض جي فاير للموبايل!»**
6. One graphic per phrase, timed to the creator's words.
7. Background music sits under the voice (ducked, voice always clear).
8. End card: **comment «السعر»** call to action, with the brand name.

## Caption style
- Premium, bold Arabic animated captions, synced word by word.
- White text, **gold** highlight on the active word or keyword, black shadow.
- RTL, modern motion graphics, clean and professional.
- Brand colours: **black, gold, white**. (Exact hex values, fonts and sizes go in `design-system.md` after the reference reels are measured in step 2.)

## Colour / look
- Premium cinematic Apple/Samsung-style tech ad look.
- Luxury black-and-gold grade, **natural skin tones** (never orange or green), clean lighting, smooth transitions.

## Export
- H.264 (libx264), **1080x1920**, yuv420p, **bt709** primaries/transfer/matrix tagged, AAC audio, `+faststart`.
- Always show the user still frames for approval **before** the final export.

## Workflow
- Work in order and **stop for the user's approval after each step**.
- Tools: Python venv `.venv/` (faster-whisper, MediaPipe, OpenCV), ffmpeg, Remotion in `remotion/`.
- Remotion renders with `--browser-executable=/opt/pw-browsers/chromium`.

## Corrections log
_(empty — add dated entries here whenever the user corrects something)_
