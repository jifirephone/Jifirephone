"""Lay a recorded voiceover onto a motion video and re-time the picture to the voice.

Usage: .venv/bin/python scripts/vo_timeline.py work/vo/clean_words.json remotion/src/studio/promo_vo.json OUT_WARP.json

The voice is the master. Each sentence plays during its scene's hold; camera moves between scenes keep
their designed duration (1:1), holds stretch or shrink to the sentence, and named words pull headline /
element frames onto the moment they are said. Output: a warp table [[real_frame, design_frame], ...]
for Remotion (useStoryFrame), the VO cut list, and the total length.
"""
import json
import sys

FPS = 30


def main():
    words = json.load(open(sys.argv[1]))["words"]
    spec = json.load(open(sys.argv[2]))
    out = sys.argv[3]
    warp = [(0, 0)]
    cuts = []
    t = 0.0                       # real seconds
    secs = lambda fr: fr / FPS
    for i, sc in enumerate(spec["sections"]):
        w0, w1 = sc["words"]
        c0 = sc.get("clip_start", words[w0]["start"])
        c1 = words[w1]["end"]
        hold_start = t
        if i > 0:                 # the move into this scene keeps its designed length
            prev_end = spec["sections"][i - 1]["design"][1]
            t += secs(sc["design"][0] - prev_end)
            hold_start = t
            warp.append((round(hold_start * FPS), sc["design"][0]))
        lead = sc.get("lead", 0.12)
        vo_at = hold_start + lead
        cuts.append({"clip_start": round(c0, 3), "clip_end": round(c1 + 0.08, 3), "real_start": round(vo_at, 3),
                     "text": " ".join(words[k]["text"] for k in range(w0, w1 + 1))})
        hold_end = max(vo_at + (c1 - c0) + sc.get("tail", 0.2), hold_start + sc.get("min_hold", 1.2))
        if "keep_end" in sc:      # the last section keeps its own designed tail
            hold_end = max(hold_end, hold_start + secs(sc["design"][1] - sc["design"][0]))
        for wi, dframe in sc.get("anchors", []):
            real = vo_at + (words[wi]["start"] - c0)
            rf = round(real * FPS)
            if warp[-1][0] < rf < round(hold_end * FPS) and warp[-1][1] < dframe < sc["design"][1]:
                warp.append((rf, dframe))
        warp.append((round(hold_end * FPS), sc["design"][1]))
        t = hold_end
    total = warp[-1][0]
    json.dump({"fps": FPS, "warp": warp, "total_frames": total, "cuts": cuts}, open(out, "w"), ensure_ascii=False, indent=1)
    print(f"total {total} frames ({total / FPS:.1f}s), {len(warp)} warp points, {len(cuts)} VO cuts")
    for c in cuts:
        print(f"  {c['real_start']:6.2f}s  <- clip {c['clip_start']:.2f}-{c['clip_end']:.2f}  {c['text']}")
    for a, b in zip(warp, warp[1:]):
        r = (b[1] - a[1]) / max(1, b[0] - a[0])
        if r > 1.6 or r < 0.45:
            print(f"  note: design {a[1]}-{b[1]} plays at {r:.2f}x")


if __name__ == "__main__":
    main()
