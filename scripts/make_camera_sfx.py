"""Movement sound from the camera path: the faster the camera travels, the louder and brighter the air.

Usage: .venv/bin/python scripts/make_camera_sfx.py remotion/src/studio/promo_camera.json OUT.wav SECONDS

Reads the same keyframes StudioPromo renders with (easeInOutCubic between keys), measures camera
speed per frame (pan + zoom + rotation), and shapes filtered noise with it, so every move gets a whoosh
that starts, peaks and settles exactly with the picture. "accents" in the JSON add soft one-shots
(voices from scripts/make_sfx.py).
"""
import json
import os
import sys
import wave

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import make_sfx as sfx  # noqa: E402

FPS = 30
SR = sfx.SR


def ease(x):
    return 4 * x ** 3 if x < 0.5 else 1 - (-2 * x + 2) ** 3 / 2


def cam(keys, f):
    if f <= keys[0]["f"]:
        return keys[0]
    for a, b in zip(keys, keys[1:]):
        if f <= b["f"]:
            t = ease((f - a["f"]) / max(1, b["f"] - a["f"]))
            return {k: a[k] + (b[k] - a[k]) * t for k in ("x", "y", "z", "rx", "ry", "rz")}
    return keys[-1]


def main():
    spec = json.load(open(sys.argv[1]))
    out, secs = sys.argv[2], float(sys.argv[3])
    keys = spec["keys"]
    n_frames = int(secs * FPS)
    pos = [cam(keys, f) for f in range(n_frames + 1)]
    speed = np.zeros(n_frames)
    for f in range(n_frames):
        a, b = pos[f], pos[f + 1]
        speed[f] = (np.hypot(b["x"] - a["x"], b["y"] - a["y"]) + abs(b["z"] - a["z"]) * 1500
                    + (abs(b["rx"] - a["rx"]) + abs(b["ry"] - a["ry"]) + abs(b["rz"] - a["rz"])) * 40)
    speed = np.convolve(speed, np.ones(5) / 5, mode="same")
    norm = (speed / max(1e-9, speed.max())) ** 1.2

    n = int(secs * SR)
    amp = np.interp(np.arange(n) / SR, np.arange(n_frames) / FPS, norm)
    noise = np.random.default_rng(5).standard_normal(n)
    air = np.zeros(n)
    blk = 1024
    for i in range(0, n, blk):
        seg = noise[i:i + blk]
        cutoff = 250 + 3800 * amp[min(i, n - 1)]
        air[i:i + blk] = sfx.lowpass(seg, cutoff)[: len(seg)]
    air *= amp * 0.55
    # gentle stereo movement following the pan direction feel
    pan = np.sin(np.arange(n) / SR * 0.7) * 0.25
    left, right = air * (1 - pan), air * (1 + pan)

    for c in spec.get("accents", []):
        v = sfx.voice(c["type"]) * c.get("gain", 0.9)
        s = int(c["f"] / FPS * SR)
        e = min(n, s + len(v))
        left[s:e] += v[: e - s]
        right[s:e] += v[: e - s]

    st = np.stack([left, right], 1)
    st = st / max(1.0, np.abs(st).max() / 0.9)
    with wave.open(out, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())
    moves = int(((norm[1:] > 0.15) & (norm[:-1] <= 0.15)).sum())
    print(f"camera sfx -> {out}: {moves} moves, {len(spec.get('accents', []))} accents")


if __name__ == "__main__":
    main()
