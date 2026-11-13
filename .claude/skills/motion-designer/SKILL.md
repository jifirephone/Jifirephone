---
name: motion-designer
description: Design and render Ji Fire for Mobile motion videos (reels, promos, explainers, kinetic typography, beat-cut edits) in Remotion from the store's real assets, with our own synthesized music and SFX. Use whenever the owner asks for a motion video, an animated ad, "انتقالات", "حركات على الخط", a style copied from a reference reel (TikTok/Facebook/Instagram), a cartoon explainer, a brand/product showcase, or to lay an ElevenLabs voiceover on a motion video.
---

# Motion designer (Ji Fire)

Builds vertical 1080×1920 / 30 fps motion videos in `remotion/` from real shop assets. Every look below already exists as a
working composition; start from the closest one instead of from scratch.

Read first: `CLAUDE.md` (rules + corrections log), `design-system.md`, and `references/styles.md` (catalog of styles + files).

## Workflow
1. **Facts before design.** Products, prices, codes come from the store (Shopify connector, read-only) or the owner's own words.
   Never invent an offer, price, warranty or number. Current owner facts: `references/facts.md`.
2. **Reference reel?** Pull frames (`ffmpeg -vf fps=3..6,scale=170:-1` → contact sheet with timestamps), zoom on key moments,
   name each technique, and copy **technique only** — never their footage, text, music, logo, or comment-keyword boxes.
3. **Pick the style** from `references/styles.md`, copy its composition into a new file, register it in `remotion/src/Root.tsx`.
4. **Stills first:** render start/end frames of every scene (`npx remotion still <Id> out.png --frame=N --browser-executable=/opt/pw-browsers/chromium`),
   montage them, check safe zone / overflow / logo collisions, fix, then render the full video.
5. **Sound:** `scripts/make_music.py` (calm bed) or `scripts/make_beat.py` (energetic 120–130 BPM beat), `scripts/make_sfx.py cues.json`
   (swish, swish_low, shimmer, bloom, riser, chime, chime_low, soft_pop, tick, pad_swell). Mix and loudnorm to −14 LUFS.
6. **Voiceover (owner's ElevenLabs take):** see `references/voiceover.md`. The voice is the master clock; scenes cut on its words.
7. Mux (`-c:v copy -c:a aac -b:a 192k -movflags +faststart`), save to `out/`, notes + cues to `scripts_reels/<name>/`,
   commit (`git add -f` for `out/` and `remotion/public/*`), send the file, explain in short Iraqi Arabic.

## Hard rules
- Brand: black / gold `#F3B406` / white, Cairo. Reference accent colours (lime, orange) become gold.
- Safe zone: text between y=230 and y=1440, 64 px left, 230 px right. Logo bug top-right; headlines never under it.
- End card: black, logo, «التقنية باعلى ذروتها». **No «اكتب السعر بالتعليقات» / comment-keyword CTA anywhere.**
- English runs stay LTR (`direction:'ltr', unicodeBidi:'isolate', display:'inline-block'`).
- Transitions vary (never the same one twice in a row); each has its own soft sound; no hard thumps.
- Images ≤ ~820 px; no per-frame `filter`/masks on photos except short transitions (render speed).
- Never use raw screen recordings or raw hand-held store photos as the main visual; rebuild clean UI / use catalog images.
- No eSIM mentions. Past offers are historical until the owner reconfirms them.
- Never publish or post anything; the owner posts.
