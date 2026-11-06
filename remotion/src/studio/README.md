# Ji Fire motion studio

Reusable motion-graphics kit (`Kit.tsx`) + the app promo built with it (`StudioPromo.tsx`, composition `StudioPromo`).

## Technique (measured from a reference reel the owner shared, work/fb, not committed)
| measured | value | used here as |
|---|---|---|
| camera moving | 74% of frames, drift ~9 px/s, moves up to ~55 px/s | `World` camera: keyed path + hand-held drift, never still |
| hard cuts | ~11 big changes in 53 s | scenes are places on one world canvas; the camera travels |
| palette | slate #21242F, panels #2D2D39, one accent | black #0A090C, panels #17151A, gold #F3B406 |
| layout | fixed top headline, one accent word | `Headline` (words blur in/out) |
| devices | floating 3D panels, focus brackets, node graph, drawn curve, big number card | `Panel`, `Brackets`, `NodeGraph`, `Curve`, numbered card |
| sound | voice + music | music + camera-driven whooshes (`scripts/make_camera_sfx.py`) |

Only technique is reused: no footage, logo, text or music from the reference.

## Making a new one
1. Write `promo_camera.json`: one key per arrival/departure, scene centres on a grid
   (x ±1400, y ±2300). Vary every move: pan, dolly-out (z < 1), tilt (rx), roll (rz), push-in, zoom-through (z > 2).
2. Put each scene in `<Place x y>` at the same centre; time its pieces to the global frame.
3. Headline lines: one short line per beat, one gold word.
4. Sound: `make_camera_sfx.py promo_camera.json cam.wav <sec>` + `make_music.py music.wav <sec> 100`, mix to −14 LUFS.
5. Render: `npx remotion render src/index.ts StudioPromo ... --concurrency=3 --timeout=240000`.
