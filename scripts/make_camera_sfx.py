"""Movement sound from the camera path: the faster the camera travels, the louder and brighter the air.

Usage: .venv/bin/python scripts/make_camera_sfx.py remotion/src/studio/promo_camera.json OUT.wav SECONDS [WARP.json]
With WARP (scripts/vo_timeline.py output) the camera and accents follow the voice-led timing.

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
    story = lambda r: r
    unstory = lambda d: d
    if len(sys.argv) > 4:
        wp = np.array(json.load(open(sys.argv[4]))["warp"], dtype=float)
        story = lambda r: float(np.interp(r, wp[:, 0], wp[:, 1]))
        unstory = lambda d: float(np.interp(d, wp[:, 1], wp[:, 0]))
    pos = [cam(keys, story(f)) for f in range(n_frames + 1)]
    speed = np.zeros(n_frames)
    for f in range(n_frames):
        a, b = pos[f], pos[f + 1]
        speed[f] = (np.hypot(b["x"] - a["x"], b["y"] - a["y"]) + abs(b["z"] - a["z"]) * 1500
                    + (abs(b["rx"] - a["rx"]) + abs(b["ry"] - a["ry"]) + abs(b["rz"] - a["rz"])) * 40)
    speed = np.convolve(speed, np.ones(5) / 5, mode="same")
    norm = (speed / max(1e-9, speed.max())) ** 1.2

    n = int(secs * SR)
    rng = np.random.default_rng(5)
    left, right = np.zeros(n), np.zeros(n)

    # split the path into moves and give each its own sound, picked by what the camera does in it
    moving = norm > 0.06
    segs, f = [], 0
    while f < n_frames:
        if moving[f]:
            g = f
            while g < n_frames and moving[g]:
                g += 1
            segs.append((f, g))
            f = g
        else:
            f += 1
    used = []
    for (a_f, b_f) in segs:
        A, B = pos[a_f], pos[min(b_f, n_frames)]
        mid = pos[(a_f + b_f) // 2]
        dz_out = min(A["z"], B["z"]) - mid["z"]           # dolly-out: zooms out in the middle
        kind = ("reverse_swell" if B["z"] > 2 else
                "tonal_down" if dz_out > 0.25 else
                "low_swoosh" if abs(mid["rx"]) > 5 else
                "shimmer_sweep" if abs(mid["rz"]) > 4 else
                "doppler" if abs(B["x"] - A["x"]) > 500 else "air")
        palette = ["air", "doppler", "low_swoosh", "tonal_up", "tonal_down", "shimmer_sweep", "whoomp", "glass"]
        # the motion picks the preferred sound; it is only used if it wasn't heard in the last 5 moves,
        # otherwise the least-used other sound takes over, so 13 moves get 8 different characters
        if kind in used[-5:]:
            kind = min((k for k in palette if k not in used[-5:]), key=lambda k: (used.count(k), palette.index(k)))
        used.append(kind)
        s0 = int(a_f / FPS * SR)
        L = int((b_f - a_f) / FPS * SR) + int(0.25 * SR)
        L = min(L, n - s0)
        env = np.interp(np.arange(L) / SR, np.arange(b_f - a_f + 8) / FPS,
                        np.concatenate([norm[a_f:b_f], np.zeros(8)])[: b_f - a_f + 8])
        t = np.arange(L) / SR
        x = rng.standard_normal(L)
        if kind == "air":
            v = sfx.bandsweep(x, 500, 3500) * 0.5
        elif kind == "low_swoosh":
            v = sfx.bandsweep(x, 180, 900) * 0.8 + np.sin(2 * np.pi * 70 * t) * 0.25
        elif kind == "tonal_up":
            ph = 2 * np.pi * np.cumsum(220 + 440 * t / t[-1]) / SR
            v = (np.sin(ph) + 0.5 * np.sin(ph * 1.5)) * 0.22 + sfx.lowpass(x, 2500) * 0.12
        elif kind == "tonal_down":
            ph = 2 * np.pi * np.cumsum(700 - 460 * t / t[-1]) / SR
            v = (np.sin(ph) + 0.4 * np.sin(ph * 2.01)) * 0.22 + sfx.lowpass(x, 1200) * 0.15
        elif kind == "doppler":
            v = sfx.bandsweep(x, 800, 2600) * 0.45
            pan = np.linspace(-0.8, 0.8, L)
            seg_l, seg_r = v * env * (1 - pan) * 0.5, v * env * (1 + pan) * 0.5
            left[s0:s0 + L] += seg_l
            right[s0:s0 + L] += seg_r
            continue
        elif kind == "shimmer_sweep":
            hp = x - sfx.lowpass(x, 4500)
            v = hp * (0.6 + 0.4 * np.sin(2 * np.pi * 11 * t)) * 0.45 + sfx.lowpass(x, 1500) * 0.15
        elif kind == "whoomp":
            v = sfx.lowpass(x, 600) * 0.7 + np.sin(2 * np.pi * (90 - 40 * t / t[-1]) * t) * 0.3
        elif kind == "glass":
            ph = 2 * np.pi * np.cumsum(1200 + 300 * t / t[-1]) / SR
            v = (np.sin(ph) + 0.6 * np.sin(ph * 1.5)) * np.exp(-t * 2) * 0.18 + sfx.bandsweep(x, 1500, 4000) * 0.2
        elif kind == "reverse_swell":
            rise = (t / t[-1]) ** 3
            v = sfx.bandsweep(x, 400, 6000) * rise * 0.7
            env = np.maximum(env, rise)
        v = v * env
        left[s0:s0 + L] += v
        right[s0:s0 + L] += v
    print("move sounds:", " · ".join(used))

    for c in spec.get("accents", []):
        v = sfx.voice(c["type"]) * c.get("gain", 0.9)
        s = int(unstory(c["f"]) / FPS * SR)
        if s >= n:
            continue
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
    print(f"camera sfx -> {out}: {len(used)} moves, {len(set(used))} different sounds, {len(spec.get('accents', []))} accents")


if __name__ == "__main__":
    main()
