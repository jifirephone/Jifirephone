# Ji Fire for Mobile — Design System

Measured from `refs/ref1.mov`, the brand's own reel: 1920x1552, 30 fps, bt709, 29 s.
Code tokens live in `remotion/src/brand.ts`. Keep both files in sync.
Status: **based on 1 reference reel.** Re-measure when more references arrive.

## 1. Colour tokens
| Token | Hex | Where it comes from / use |
|---|---|---|
| `gold` | `#F3B406` | Logo gold (median of 58k px). Active word, keywords, CTA pill, price highlights |
| `goldDeep` | `#C98F00` | Darker gold for gradients and edges |
| `silver` | `#DCDCDC` | Logo swoosh. Secondary lines, dividers |
| `white` | `#FFFFFF` | Caption body text |
| `black` | `#000000` | End card background, text stroke and shadow |
| `backdrop` | `#5B5065` | Lit part of the purple-grey studio wall |
| `backdropDark` | `#060407` | Vignetted corners |

## 2. Colour grade (the "look")
- **Low-key and moody:** deep blacks (5th-percentile L = 3/255), median L ≈ 33, highlights stop at about L 108. Don't lift the blacks.
- **Strong vignette:** wall goes from `#5B5065` behind the subject to `#060407` in the corners.
- **Cool backdrop vs warm skin:** backdrop is a cool purple-grey; skin stays natural and slightly warm (measured mean `#98766F`). Never push skin orange or green.
- **Moderate saturation** (mean S ≈ 68/255). The red/gold of products and the logo should be the only strongly saturated colours.
- **Transform for phone footage:** lower the blacks, add a gentle S-curve and vignette, and check skin on a vectorscope-style sample. No teal-and-orange LUTs.

## 3. Typography
- **Font:** Cairo (variable, files in `remotion/public/fonts/`). 900 for captions, 800 for secondary text, 600 for body text.
- Product names and tech terms are written in English and set as **one LTR run** (`iPhone 16 Pro`, never reversed).

## 4. Captions
- **Position:** lower-right block, right-aligned, RTL, as in the reference. Bottom of block at y = 1520 (400 px above the bottom). Right margin 150 px to stay clear of the Instagram/TikTok button rail.
- **Size:** 96 px, line-height 1.18. The reference's ~100 px lines at 1552 tall scale to about 96 px at 1920.
- **Lines:** at most 3 words per line and 2 lines on screen. Older lines scroll off.
- **Reveal:** word by word as spoken. Each word fades in and rises 28 px with a spring, settling in about 5 frames.
- **Colour:** white by default. The **word being spoken is gold**, and keywords (price, brand, offer) stay gold.
- **Legibility:** 3 px black stroke, plus a hard 5 px drop shadow and a soft 22 px shadow.
- Reference shows a brief rainbow/holographic shimmer as words enter. It is **not used**, because it conflicts with the brief's white + gold. Easy to add if wanted.

## 5. Logo bug
- Logo (`brand/logo.png`, extracted from the end card, transparent background) in the **top-right** for the whole reel.
- Width 210 px (≈15 % of frame width, as in the reference), top 170, right 64.

## 6. Structure and pacing (from reference)
- **0–2 s:** product close-up in hand (hook visual), then hard cut to talking head.
- Talking head is mostly one continuous shot. Captions carry the rhythm.
- **One stylised transition mid-reel:** torn-paper reveal with a black-and-white halftone frame (reference at 10.2–10.6 s). Use at most once per reel, at a topic change.
- **End card (last ~3.5 s):** black background, centred logo pops in, then the white tagline **«التقنية باعلى ذروتها»** (Cairo 800, 64 px), then the CTA **اكتب [السعر] بالتعليقات** with «السعر» in a gold pill. The reference ends with a glitch/burn-out of the logo.

## 7. Graphics (one per phrase)
- Gold-accented cards on dark glass: product name (English), price in IQD/USD (gold), "ضمان" / "أقساط" badges.
- Enter with a short spring (≤ 8 frames), exit with a fade. Never cover the face or the product in hand.

## 8. Audio
- Final mix: **−14 LUFS integrated**, true peak ≤ −1 dBTP (reference measured −14.5 LUFS).
- Music about 20 dB under the voice and ducked while speaking. Voice always clear.

## 9. Safe zone (1080x1920)
Top 220 · bottom 400 · left 64 · right 150. Nothing important outside it.
