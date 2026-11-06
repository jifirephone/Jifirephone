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
1. Transcribe with `scripts/transcribe.py` (faster-whisper `large-v3`, Arabic, word timestamps).
   - Its prompt spells numbers as words. Never put digits in it, or Whisper writes "10,000" instead of «بعشرة الاف».
   - Brand mis-hearings are fixed by `FIXES` («جاي فايل» → «جي فاير»). Hallucinations over music («اشتركوا في القناة») are dropped.
   - **Always show the user the transcript and let them correct it before rendering captions.**
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
- Brand colours: **black, gold `#F3B406`, white**, silver `#DCDCDC`. Font **Cairo** (900 captions).
- Captions sit lower-right, right-aligned, 96 px, max 3 words/line and 2 lines. The spoken word is gold.
- Consecutive English words/numbers are one LTR run ("iPhone 16 Pro", never reversed).
- Logo bug (`brand/logo.png`) top-right the whole reel. End card: black, logo, «التقنية باعلى ذروتها», then «اكتب السعر بالتعليقات».
- **Full rules and measurements: `design-system.md`. Read it before every edit.**

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
- Models live in `models/` (gitignored): Whisper `large-v3` via `download_root='models/whisper'`, MediaPipe `models/face_landmarker.task`.
- Keep `av<16` (newer PyAV breaks faster-whisper). MediaPipe needs system `libegl1 libgles2`. Always call `landmarker.close()`.

## Installed skills
- `motion-reel` (`.claude/skills/motion-reel/`, installed 2026-11-06 from the user's zip): pure motion-graphics promos from code
  (HTML canvas + Playwright + ffmpeg + synthesized SFX). Use it for product promos/animated ads **without** talking-head footage.
  Talking-head reels keep using this project's pipeline (Whisper → plan → Remotion).
- Adapting it to this cloud machine: it is **Linux, not Windows** (ignore the PowerShell/certutil note in its rules.md).
  **Do not run `npx playwright install`**: Chromium is preinstalled (use `/opt/pw-browsers/chromium` if needed).
  `beats.py` needs `librosa`, which isn't installed yet. Install it only when a music track is supplied.
- Its brand rules don't replace ours: colours, fonts, captions and the end card still come from `design-system.md`.
  Its "Arabic: direction = 'rtl'" rule applies, with the Cairo font.

- `ig-*` (13 skills from github.com/Jakeschincariol/instagram-agent-skill @ d03c56b, MIT, installed 2026-11-06):
  scripts, hooks, captions, carousels, stories, DMs, comments, plans, audits, humanizer. They never post or send anything.
  **Limitation:** `hookscore.py` and `beats.py` only count Latin letters, so Arabic lines score 0 words
  (our hook scored 8.4 WEAK only because of that). Don't trust their scores or timings on Arabic text until patched.
  They read `~/.claude/instagram/voice.md` (not created yet).

## Corrections log
- 2026-11-06 — Step 2 approved. Captions white + gold, no rainbow shimmer (default kept; user can ask for it).
- 2026-11-06 — Re-edit of refs/ref1.mov approved and exported (`out/jifire_sim-offer_final.mp4`). The 5 doubtful words (سعر/دينار, مليون وثمانين دولار, وين تلقونها, شركة التقنية الهواتف, زاد→زائد) were exported as transcribed and are still unconfirmed by the user.
