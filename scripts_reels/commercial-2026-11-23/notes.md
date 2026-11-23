# Cinematic commercial (2026-11-23)
Owner brief: full cinematic commercial (6 scenes, 45–60 s, VO, captions, SFX list, 7 deliverables, strict honesty rules).
Built in Remotion (`remotion/src/commercial/`), data in `config.json`. Deliverables in `out/commercial/` (see its README).
- Not done here: VO (no voice generator in this environment → `out/commercial/VOICEOVER.md` for ElevenLabs); 4K (command given, not rendered).
- Real-data choices: used device = «آيفون 17 برو ماكس مستعمل 256GB AFA – بطارية 98% – نظافة 100%», 1,825,000, SKU 2265 (Shopify 2026-11-23).
  Old site cart captures not used (expired j2026 code, eSIM chip, old prices). Search screen not captured → not shown.
- 3D: devices are flat catalog cut-outs given perspective swings, reflections and parallax (no 3D models exist); map is illustrative (dots, no borders).
- Owner text change: «بكل سهولة» → «واطلبه بكبسة زر» (voicecheck AI-phrase flag); owner may revert.
- New tools: `scripts/make_sfx_cine.py` (cinematic SFX synth), reuse `make_beat.py` at 120 BPM.
Cut-out snippet (white background → PNG): see the cv2 block used on 2026-11-23 (threshold min>232 & spread<16, border-connected, median+gauss).
