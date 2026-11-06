"""Synthesize transition SFX for a RepairReel plan: soft whooshes on each crossfade,
a gold shimmer on the reveal shot, and a low "boom" when the end card comes in.

Usage: .venv/bin/python scripts/sfx_transitions.py plans/<name>.json remotion/public/clip/<name>_sfx.wav
Timings mirror remotion/src/RepairReel.tsx (layout(), GoldSweep, EndIn).
"""
import json
import sys
import wave

import numpy as np

SR = 48000
FPS = 30
END_CARD = 3.5
rng = np.random.default_rng(7)


def layout(plan):
    x = round(plan["xfade"] * FPS)
    at, out = 0, []
    for i, s in enumerate(plan["shots"]):
        n = round((s["to"] - s["from"]) / s["speed"] * FPS)
        start = 0 if i == 0 else at - x
        at = start + n
        out.append(start)
    return out, at, x


def bandpass_sweep(noise, f0, f1, q=1.2):
    """Noise through a resonant band-pass whose centre glides f0→f1 (state-variable filter)."""
    n = len(noise)
    fc = np.geomspace(f0, f1, n)
    lo = bp = 0.0
    out = np.empty(n)
    damp = 1 / q
    for i in range(n):
        f = 2 * np.sin(np.pi * fc[i] / SR)
        hi = noise[i] - lo - damp * bp
        bp += f * hi
        lo += f * bp
        out[i] = bp
    return out


def whoosh(dur=0.55, f0=350, f1=2600, peak=0.6, gain=0.85):
    n = int(dur * SR)
    t = np.linspace(0, 1, n)
    env = np.where(t < peak, (t / peak) ** 2, ((1 - t) / (1 - peak)) ** 1.6)
    sig = bandpass_sweep(rng.standard_normal(n), f0, f1) * env
    return sig / (np.abs(sig).max() + 1e-9) * gain, int(peak * n)


def shimmer(dur=1.2, gain=0.4):
    n = int(dur * SR)
    t = np.arange(n) / SR
    sig = np.zeros(n)
    for k, f in enumerate([1568, 2093, 2637, 3136, 4186]):  # G6 C7 E7 G7 C8 — bright, major
        onset = k * 0.045
        tt = np.clip(t - onset, 0, None)
        sig += np.sin(2 * np.pi * f * tt) * np.exp(-tt * 3.2) * (t >= onset) / (1 + k * 0.3)
    sig *= 1 + 0.15 * np.sin(2 * np.pi * 7 * t)  # light sparkle tremolo
    return sig / np.abs(sig).max() * gain


def boom(dur=1.0, gain=0.85):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 70 * np.exp(-t * 2.5) + 38
    sig = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 4.0)
    sig *= np.minimum(1, t / 0.006)
    return sig * gain


def add(buf, sig, at_s):
    i = max(0, int(at_s * SR))
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i]


def main():
    plan = json.load(open(sys.argv[1]))
    starts, foot, x = layout(plan)
    total = foot / FPS + END_CARD
    buf = np.zeros(int(total * SR) + SR)
    reveal = plan.get("revealShot", -1)
    for i, st in enumerate(starts[1:], start=1):
        mid = (st + x / 2) / FPS
        if i == reveal:
            w, pk = whoosh(0.8, 250, 5000, peak=0.55, gain=0.9)
            add(buf, w, mid - pk / SR)
            add(buf, shimmer(), mid - 0.05)
        else:
            w, pk = whoosh()
            add(buf, w, mid - pk / SR)
    end_in = (foot - 10) / FPS
    w, pk = whoosh(0.6, 3000, 300, peak=0.7, gain=0.6)  # falling whoosh into black
    add(buf, w, end_in + 0.17 - pk / SR)
    add(buf, boom(), end_in + 0.17)
    # stereo, slight decorrelation for width
    left, right = buf, np.roll(buf, int(0.004 * SR))
    pcm = (np.clip(np.stack([left, right], 1), -1, 1) * 32767).astype("<i2")
    with wave.open(sys.argv[2], "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(pcm.tobytes())
    print(f"{sys.argv[2]}: {len(starts) - 1} transitions, reveal shot {reveal}, end card at {end_in:.2f}s")


if __name__ == "__main__":
    main()
