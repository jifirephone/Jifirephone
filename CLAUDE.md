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
8. End card: black, logo and tagline only. **No «اكتب السعر بالتعليقات» / comment-keyword CTA anywhere** (owner, 2026-11-08). If a CTA is needed, use the owner's own: visit the shop or order from the app.

## Caption style
- Premium, bold Arabic animated captions, synced word by word.
- White text, **gold** highlight on the active word or keyword, black shadow.
- RTL, modern motion graphics, clean and professional.
- Brand colours: **black, gold `#F3B406`, white**, silver `#DCDCDC`. Font **Cairo** (900 captions).
- Captions sit lower-right, right-aligned, 90 px, max 3 words / 14 chars per line and 2 lines. The spoken word is gold.
- **Safe zone: text only between y=230 and y=1440, 64 px from the left, 230 px from the right** (Instagram UI).
- Consecutive English words/numbers are one LTR run ("iPhone 16 Pro", never reversed).
- Logo bug (`brand/logo.png`) top-right the whole reel. End card: black, logo, «التقنية باعلى ذروتها» (no comment CTA).
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
  **Patched for Arabic (2026-11-06)** in `.claude/skills/ig-reel/`: `arabic_ig.py` (new), `hookscore.py`, `beats.py`, `dialect.py` (new).
  Arabic, English, mixed lines and ٠-٩ digits are counted. Numbers are timed as they are said («1,450,000» = 4 words).
  Rate is **140 wpm**, measured on the creator, plus 0.2 s per sentence and 0.1 s per comma. Iraqi number, money, offer,
  tension and address words are recognized. Device names spelled in Arabic count too (ايفونك). An OFFER check measures the marketing value of a hook.
  English results are identical to upstream. Before/after: `python3 tests/compare_ig_tools.py`. Tests:
  `python3 -m unittest discover -s tests` (must pass before committing any change to these tools).
  Upstream originals are kept in `tests/upstream_ig_reel/`. If the pack is updated from GitHub, re-apply the patch and re-run the tests.
- **Voice profile:** `brand/voice.md` is the source of truth. At the start of every session, if
  `~/.claude/instagram/voice.md` is missing, run `mkdir -p ~/.claude/instagram && cp brand/voice.md ~/.claude/instagram/voice.md`.
  Edit `brand/voice.md`, never only the copy.

- **`jifire-voice`** (`.claude/skills/jifire-voice/`, created 2026-11-06): the owner's voice for **every** Arabic text
  (scripts, captions, replies, DMs, stories). Rules: `references/voice-guide.md`. Real lines: `references/samples.md`.
  Checker: `scripts/voicecheck.py --kind script|caption|reply|dm|story` (Arabic AI-phrase lexicon `ai_tells_ar.json`,
  structure tells, Iraqi vs فصحى, rhythm, fingerprint). **Every customer-facing text must PASS before it is shown.**
  Every line the owner approves or rewrites goes into `samples.md` (Approved / Rejected). `scripts/arabic_ig.py` is a
  copy of `ig-reel/arabic_ig.py`; tests fail if they differ, so copy it after every change.

- **Owner's 4 Ji Fire skills** (installed 2026-11-07 from the owner's zips; instructions only, no code):
  `jifire-video-editor` (reels), `jifire-ads-designer` (ads, Firebase 1200×600 notifications, posts),
  `jifire-hello-bot-engineer` (MSG91 Hello bot, Shopify product search, Instagram/Messenger, ViaSocket),
  `jifire-shopify-manager` (catalog, used devices, SEO). They share `references/brand.md` (location, hours, phone, links).
  **Precedence:** for reels in this project, this file + `design-system.md` win (phased approval, safe zone, captions);
  the skills add rules on top. Their strict rules apply everywhere: never invent product data or offers; **past offers
  (e.g. the 25,000 IQD discount, J2026, USED codes) are historical until the owner reconfirms them**; no eSIM mention;
  one design per product; never claim an upload/publish/integration worked without read-back verification.
  **Shopify is connected (2026-11-07) through the claude.ai Shopify connector** (store «جي فاير للموبايل», IQD). Use it **read-only**
  unless the owner explicitly asks for a change, show the change first, and read back after. If its tools say "sign in again",
  the owner reconnects in claude.ai Settings → Connectors. Product images are on `cdn.shopify.com` (not yet an allowed host).
  No MSG91 / Firebase / Meta connection exists yet: give copy-ready plans, never claim live edits.

## Script rules (every reel script, permanent)
1. Write in natural **Iraqi dialect**. Device names and tech terms stay in English on screen (iPhone, Face ID, Swap).
2. Check each script with the three tools before showing it:
   `hookscore.py` (3 hooks from different formulas; the chosen one **STRONG ≥ 70** and **≤ 3 s spoken**),
   `beats.py --target <seconds of speech>` (no beat > 4 s; no 3 abstract beats in a row; the last line echoes the hook),
   and `dialect.py` (**Iraqi ≥ 80 %**, zero فصحى).
3. **Length** = speech + 3.5 s end card. For a 40 s reel, aim for about 36 s of speech.
4. **Never invent** prices, warranty periods, repair times or results. Use `{{السعر}}`, `{{مدة الضمان}}`, `{{وقت التصليح}}` and flag them.
5. Spoken hook is one short sentence (≤ 3 s). The longer brand hook «…شوف عروض جي فاير للموبايل!» goes **on screen**
   (the full line takes 4.9 s to say and scores 69 OK; its first sentence alone scores 96 STRONG).
6. Scripts live in `scripts_reels/<name>/` (`script.txt`, `hooks.txt`, `script.md` with the scene table and test results).
7. **Never publish, post, comment or DM customers automatically.** Every post and every message waits for the owner's approval.
8. Brand links (confirmed by the owner 2026-11-06, both spellings are correct and are different links):
   - **Website:** https://jifirephone.com
   - **App (Google Play + App Store):** https://app.jifrephone.workers.dev. Use it on screen for «حمّل التطبيق» / app CTAs.
9. Content areas: new and used phones, accessories, instalments, offers, iPhone repair (screens, sensors, board, Swap, software).

## Corrections log
- 2026-11-06 — Step 2 approved. Captions white + gold, no rainbow shimmer (default kept; user can ask for it).
- 2026-11-06 — Re-edit of refs/ref1.mov approved and exported (`out/jifire_sim-offer_final.mp4`). The 5 doubtful words (سعر/دينار, مليون وثمانين دولار, وين تلقونها, شركة التقنية الهواتف, زاد→زائد) were exported as transcribed and are still unconfirmed by the user.
- 2026-11-06 — ig-reel tools patched for Iraqi Arabic, voice.md created, first scripted reel (iPhone repair, 40 s) in `scripts_reels/iphone-repair/`.
- 2026-11-06 — Correction: `app.jifrephone.workers.dev` is the **app link (Google Play + App Store)** and `jifirephone.com` is the **website**. Both spellings are right; don't flag them again.
- 2026-11-06 — Owner delegated two calls ("اعمل من يمك"): (1) no invented price/warranty; script lines rewritten to need none, and the «السعر» comment brings the price; (2) safe zone raised to 230/1440/right 230, captions 90 px.
- 2026-11-06 — Created the `jifire-voice` skill. Three test cases pass. The AI caption scores 27.5 FAIL, the owner's real reel 95 PASS.
- 2026-11-06 — Correction (app promo): transitions were all the same gold wipe and the text all moved the same way. **Rule:** in motion videos, never repeat the same transition twice in a row; transitions must be soft and calm, each with its own soft sound (`scripts/make_sfx.py`: swish, chime, bloom, shimmer, riser, pad_swell, never hard thumps), and text animation styles must vary between scenes (rise, blur, scale, slide, drop, wipe). Use staggered crossfades so two lines of text never stack.
- 2026-11-07 — Owner asked for the style of a reference reel (camera moves, transitions, movement sound): built the **motion studio** (`remotion/src/studio/`, see its README). **Rule for motion videos from now on:** camera never fully still (drift + eased moves on one world canvas), fixed top headline with one gold word, 3D floating panels, varied camera moves (pan, dolly, tilt, roll, zoom-through) instead of cuts, movement sound generated from the camera path. Copy technique from references, never their footage, logo, text or music; don't commit third-party videos.
- 2026-11-07 — Correction: movement sound was the same whoosh on every camera move. **Rule:** each move gets its own sound by motion type (doppler pan, low swoosh tilt, tonal up/down, shimmer roll, whoomp, glass, reverse swell zoom-through), and the same sound never repeats within 5 moves (`make_camera_sfx.py`). In-scene accents vary too.
- 2026-11-07 — Owner sent a voiceover and asked to improve it. **Workflow for every recorded voice:** `scripts/enhance_voice.sh` (HPF, denoise, soft gate, de-mud EQ, presence, de-ess, compress, −16 LUFS), Whisper to check no words were lost, then `scripts/vo_timeline.py` so the **voice is the master clock**: each sentence plays in its scene hold, moves keep their speed, headlines appear on the word (`useStoryFrame` / `promo_warp.json`). Music and movement sounds duck under the voice; final mix −14 LUFS.
- 2026-11-07 — Owner sent two ElevenLabs takes (voice "Ali Al Bazzaz – Iraqi Narration/Commercials") and asked me to pick. File 1 held the script twice; **chose its first take**: 51/51 words correct, most expressive (LRA 4.4 vs 2.3), clear pauses, 28 s. File 2 (26.6 s) was rushed and flat. AI voices get a light chain (no gate/denoise). Exported `out/jifire_app-promo_ai-voice.mp4` (38.7 s). Owner-voice timing kept in `promo_warp_owner.json`; AI-voice timing is `promo_warp.json` / `promo_vo_ai.json`. Mix check: pad the voice track to full length before mixing, or the music tail is cut.
- 2026-11-07 — Installed the owner's 4 Ji Fire skills (video editor, ads designer, Hello bot engineer, Shopify manager). Shop facts added to `brand/voice.md` as **verify before public use**.
- 2026-11-07 — Offer reel from the owner's app recordings (iPhone 17/18 Pro Max, S26 Ultra, code 25k = `j2026` shown in app, free delivery, warranty + receipt, ends 10/11). Owner-given today → current; **historical after 10/11**. In headlines, consecutive English words must be one LTR run (`runs()` in OfferPromo) or «Galaxy S26 Ultra» renders reversed. Avoid zooming on app variant chips that show «شريحة الكترونية» (no eSIM rule).
- 2026-11-07 — **Correction:** the offer reel looked like the owner's raw screen recordings dropped into a phone frame ("منزلهن مثل ماهن"). **Rule:** never use app screen recordings as-is. Work from app **screenshots**: cut out the real UI pieces (product card, image, price, code box, timer, buttons, badges), rebuild them as separate layers, and animate them (3D floating cards, staggered build-up of the page, zoom/focus on the key element, highlights, tap markers, kinetic text, studio camera). Real footage only as a short accent, never as the main visual.
- 2026-11-07 — Offer reel v2 exported from Shopify data (`out/jifire_offer_v2_shopify.mp4`). **Render-speed rule:** keep product images ≤ ~820 px and avoid per-frame `filter`/`drop-shadow`/image masks on photos (use gradients behind them); v1 of this scene took >40 min, now ~4 min. Font loader is time-boxed with retries (`fonts.ts`).
- 2026-11-07 — **Owner price instruction:** iPhone 18 Pro Max in the offer ad «يبدي من 2,575,000». Owner-given price wins over the store reading (store showed 2,625,000 physical SIM); store not changed.
- 2026-11-08 — **Owner price instruction:** iPhone 17 Pro Max in the offer ad «يبدي من 1,950,000» (store shows 2,100,000 physical SIM; store not changed). ElevenLabs VO (Ali Al Bazzaz) laid on ShopPromo: scenes re-timed to the voice (40.2 s), SFX cues remapped (`sfx_cues_v3.json`). The recorded line «بمليونين ومية الف» contradicts the new price, so only «ايفون 17 Pro Max» is kept from that line until the owner sends a regenerated line. **Rule:** if a voiceover says a price that differs from the screen, never ship it; cut the price words or re-record.
- 2026-11-08 — Owner sent ElevenLabs take v4 (script `voiceover_v3.md`, 35.5 s). All prices/words correct, but the first word came out **«تبحث» (فصحى)** instead of «تدور» (Whisper 0.92 even when prompted «تدور»): ElevenLabs can swap dialect words for MSA, so **always check the first word / dialect words of every AI take**. Preview `out/preview_v4_vo.mp4` (42.2 s) starts the voice at «ايفون 17…»; scenes re-timed to this take, SFX `sfx_cues_v4.json`, mix −14.8 LUFS.
- 2026-11-08 — **Correction:** «الف» sounded like «ال», the «ف» was lost. Cause: VO sentences were cut at Whisper word ends, which are ~0.1–0.3 s early, then faded and de-essed. **Rule for every voiceover:** cut sentences only inside real silences (`silencedetect -45dB`), never at Whisper word ends; no de-esser on AI voices; keep word-final fricatives (ف، س، ش) whole; verify with Whisper on the final voice track. Take v5 used (starts «تريد», all prices right); the «ف» of each sentence-final «الف» gets a light lift (+5 dB above 2.5 kHz over its last 0.2 s). Preview `out/preview_v5_vo.mp4` (43 s), SFX `sfx_cues_v5.json`, mix −14.7 LUFS.
- 2026-11-08 — Repair reel «13 Pro Max → شكل 17 Pro Max» (housing conversion) from the owner's top-down shoot (`inbox/shoot-2026-11-08`, 66 uploads, clips 35-66 were duplicates; unique 01-34, 720p landscape, no speech). Owner wrote the brief and changed the VO's CTA to the shop address (approved). Composition `remotion/src/conv/ConvReel.tsx`; segments cut/re-timed/cropped 9:16 by `scripts/make_segments.py` from `segments.json`; headlines sit **below the logo bug (y ≥ 410)**, never beside it. Wording stays honest: «بشكل 17 Pro Max». Preview `out/preview_13to17.mp4` (35.5 s, −14.5 LUFS).
- 2026-11-08 — **Correction (repair reel):** "the camera is too close" and "the first shot shows the technician's hand". **Rule:** for landscape source footage, don't fill 9:16 with a tight crop; use the panel layout (`make_segments.py --layout panel`: wider 4:5 view, 1080×1350 at y=470 over a blurred copy, headlines above the panel), and open on the **device, not hands** (a clean still with a slow camera glide is fine). Trailing ؟/! after English words attach to the left of the LTR run (`punct` in ConvReel `runs()`). Owner asked to split the footage into **two 35 s reels**: reel 1 = story (existing VO), reel 2 = details (`voiceover2.md`, waiting for the ElevenLabs take).
- 2026-11-08 — Repair reel 2 (details) built from the owner's ElevenLabs take (all words right): `remotion/src/conv/ConvReel2.tsx`, `segments2.json`, `sfx_cues2.json`, preview `out/preview_13to17_reel2.mp4` (35.5 s, −14.4 LUFS). Bidi note: «؟» is an Arabic-letter (AL) character, so a number after it flips sides; the punctuation span must be `unicode-bidi: isolate` + inline-block.
- 2026-11-08 — Explainer cartoon («كارتون قريب للواقع») after the owner's TikTok reference (technique only, our own cast): real storefront cartoonised with OpenCV (`brand/storefront.jpg` → bilateral + k-means + thin ink, lit signs kept), original SVG characters «حيدر» and «علي» (`remotion/src/explainer/Toon.tsx`), boards, icons, app phone, delivery scooter, word captions. Owner's take added «ثاني يوم يوصلك» (owner claim). Preview `out/preview_explainer.mp4`.
- 2026-11-08 — **Correction (permanent):** «اكتب السعر بالتعليقات» removed — "I never use it". **Rule:** no comment-keyword CTA anywhere (end card, voiceover, captions, scripts). End card = black, logo, «التقنية باعلى ذروتها». If a CTA is needed, use the owner's own: visit the shop (النجف، ميلاد، شارع الحولي) or order from the app. Updated `Brand.tsx` EndCard, `brand.ts`, `design-system.md`, `brand/voice.md`, `jifire-voice` voice-guide. Repair reel 2's spoken «اكتب السعر بالتعليقات» was cut (voice ends after «يصير 17؟», cut in the pause). Earlier exports in `out/` still carry the old end card.
- 2026-11-09 — How-to-order tutorial from the owner's real site (jifirephone.com, www, tfmwtv-d3.myshopify.com added to the environment's allowed hosts with the owner's approval). Captured on a phone viewport with Playwright; **no order placed** (checkout needs phone + WhatsApp OTP; a real order is the owner's call). Hide the «ابتداءً من 1,975,000» header (eSIM price). j2026 ends 10/11 00:00 Baghdad: the VO says «كود الخصم» only, so a new code means re-capturing the site pieces, not re-recording. Preview `out/preview_howto_order.mp4`.
- 2026-11-09 — **Shopify theme edit (owner-approved):** white & gold cart applied to the **unpublished** theme «تيست سلة» only (`design/theme_patch/`, backups in `design/theme_backup/`). Rule for theme work: back up every file first, never touch the MAIN theme, prefer a new CSS file over editing liquid, read back and compare checksums, check a real `?preview_theme_id=` render, and let the owner publish.
- 2026-11-10 — iCloud/passcode **unlock** promo (X→17 Pro Max) from the owner's own repair footage (`inbox/x17-2026-11-10`: locked «iPhone غير متوفر» → flashed on a programmer box → activation-lock → boots to home). Legitimate, openly-offered repair service; kept honest — framed as the customer's **own** forgotten passcode/iCloud, never stolen devices, and the owner's **«الأجهزة المبلّغ عنها فقدان ما نشتغلها»** is a full-screen caution card (scene 6). `remotion/src/x17/X17Reel.tsx`, script `scripts_reels/x17-2026-11-10/`, final `out/preview_x17_unlock.mp4` (owner ElevenLabs take, 26 s, all words right; cuts in VO pauses, −14.8 LUFS). Clips are vertical already (p2–p4 rotated −90); no panel crop.
- 2026-11-10 — Unlock reel VO laid (owner ElevenLabs take, 26 s, all words correct incl. «اكس»/«سبعطعش»/«الآيكلاود», no فصحى). Whole take runs continuously; the 8 picture cuts sit in the VO's real pauses (silencedetect) so nothing is clipped. `out/preview_x17_unlock.mp4` (29.4 s, −14.8 LUFS). Earlier «البنل الرئيسي» question was about THIS video, not a website banner (a homepage-banner mockup `design/banner/` was built by mistake and set aside).
- 2026-11-12 — **Owner warranty fact:** new devices = **ضمان سنة**, used devices = **ضمان شهر**, both with a warranty receipt (وصل ضمان). Never say «ضمان شهر» for everything. Showcase reel: VO «شهر» cut, row shows both. Also: ElevenLabs can render «ويه» as a laugh-like «وإيه»; check connector words like this in every take.
