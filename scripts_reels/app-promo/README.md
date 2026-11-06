# App promo: motion graphics (no footage), 32 s, 1080x1920

Copy from the owner (2026-11-06): instalments from home, no down payment, 1-year warranty, delivered to the
door, free delivery, 25,000 discount, app on Google Play + App Store, new and used phones, computers, accessories.
On-screen text: `onscreen.txt`. voicecheck: PASS 98.9, Iraqi 100%. Hook «تريد جهاز بالأقساط؟ وانت ببيتك؟» 75.5 STRONG.

- Composition: `remotion/src/AppPromo.tsx` (`AppPromo`). 12 scenes on a 120 BPM grid (2 s per bar),
  gold diagonal wipe on every cut, words rise per word, line icons draw in, slow camera push.
- Sound: `scripts/make_music.py work/promo/music.wav 32 120` + `motion-reel/scripts/sfx.mjs sfx_cues.json`.
  Mixed to −14.8 LUFS, peak −1.4 dB. No voiceover (owner can record one; it gets synced to the scenes).
- Export: `out/jifire_app-promo_motion.mp4`, H.264, bt709, 32 s.
