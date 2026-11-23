# Commercial deliverables (2026-11-23)
| File | What |
|---|---|
| `jifire_commercial_no-vo.mp4` | Full picture + music + SFX, captions burned in (VO pending). H.264, 1080×1920, yuv420p, bt709, AAC, faststart, 58.4 s, −13.8 LUFS |
| `jifire_commercial_no-music_no-vo.mp4` | Same picture, SFX only (−16 LUFS). The "no music" version with voice is made when the VO arrives |
| `cover_9x16.png`, `cover_4x5.jpg` | Cover / thumbnail |
| `storyboard.jpg`, `STORYBOARD.md` | Shot-by-shot plan |
| `VOICEOVER.md` | ElevenLabs text, settings, timing |
| `stems/music.wav`, `stems/sfx.wav`, `stems/sfx_cues.json` | Separate music and SFX stems + the cue list |
| `sfx_library/*.wav` | The 10 individual sounds (impact, sub_drop, metal_hit, glitch, ui_click, rev_riser, whoosh, whoosh_l, logo_reveal, sweep) |

Licensing: music (`scripts/make_beat.py`) and every SFX (`scripts/make_sfx_cine.py`) are synthesized from code in this project —
original, no samples, no third-party licence needed.

## Edit without rebuilding
Everything changeable is in `remotion/src/commercial/config.json`: devices (image + name), the used-device card (photo + 5 rows),
brand names, categories, delivery lines, address, links, voice-over lines and timings. New device images: put a transparent PNG in
`remotion/public/cine/` (white-background photos can be cut out with the snippet in `scripts_reels/commercial-2026-11-23/notes.md`).

Render (from `remotion/`):
```
npx remotion render Commercial out.mp4 --browser-executable=/opt/pw-browsers/chromium            # 1080×1920
npx remotion render Commercial out_4k.mp4 --scale=2 --browser-executable=/opt/pw-browsers/chromium # 2160×3840 (4K), ~4× slower
```
then mux the audio and re-encode with:
`ffmpeg -i out.mp4 -i mix.wav -map 0:v -map 1:a -c:v libx264 -crf 16 -pix_fmt yuv420p -color_primaries bt709 -color_trc bt709 -colorspace bt709 -c:a aac -b:a 256k -movflags +faststart final.mp4`
SFX: `.venv/bin/python scripts/make_sfx_cine.py stems/sfx_cues.json sfx.wav 58.4` · music: `.venv/bin/python scripts/make_beat.py music.wav 58.4 120 8 3.4`.
