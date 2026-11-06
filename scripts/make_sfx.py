"""Soft, calm transition sounds for motion-graphics reels (all synthesized, royalty-free).

Usage: .venv/bin/python scripts/make_sfx.py cues.json OUT.wav SECONDS
cues.json: [{"t": 4.0, "type": "swish", "gain": 0.8}, ...]

Every voice has a slow attack (no clicks) and is low-passed, so transitions feel smooth
rather than punchy. Each transition type in AppPromo.tsx has its own sound.
"""
import json
import sys
import wave

import numpy as np

SR = 48000
rng = np.random.default_rng(11)


def env(n, attack, release):
    t = np.arange(n) / SR
    a = np.clip(t / max(attack, 1e-3), 0, 1)
    r = np.clip((n / SR - t) / max(release, 1e-3), 0, 1)
    return (np.sin(a * np.pi / 2) ** 2) * (np.sin(r * np.pi / 2) ** 2)


def lowpass(x, cutoff):
    # simple FFT brick-wall with a soft roll-off; fine for short sounds
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / (1 + (f / cutoff) ** 4)
    return np.fft.irfft(X, len(x))


def bandsweep(noise, f0, f1):
    """Noise whose brightness glides from f0 to f1 (an airy 'swish')."""
    n = len(noise)
    out = np.zeros(n)
    seg = 2048
    for i in range(0, n, seg):
        c = f0 + (f1 - f0) * (i / n)
        out[i:i + seg] = lowpass(noise[i:i + seg], c)[: len(noise[i:i + seg])]
    return out


def tone(freqs, dur, decay):
    t = np.arange(int(dur * SR)) / SR
    return sum(np.sin(2 * np.pi * fr * t) * np.exp(-t * decay) for fr in freqs) / len(freqs)


def voice(kind):
    if kind == "swish":          # soft airy swish, rising
        n = int(0.55 * SR)
        return bandsweep(rng.standard_normal(n), 900, 3200) * env(n, 0.25, 0.25) * 0.35
    if kind == "swish_low":      # same family, darker and slower (push transitions)
        n = int(0.7 * SR)
        return bandsweep(rng.standard_normal(n), 400, 1400) * env(n, 0.35, 0.3) * 0.45
    if kind == "riser":          # gentle 0.8 s lift into the next scene
        n = int(0.8 * SR)
        return bandsweep(rng.standard_normal(n), 300, 5000) * env(n, 0.7, 0.1) * 0.3
    if kind == "chime":          # soft gold bell (E6 + B6)
        x = tone([1318.5, 1975.5], 1.4, 3.2)
        return x * env(len(x), 0.01, 0.6) * 0.22
    if kind == "chime_low":      # warmer bell (A5 + E6)
        x = tone([880.0, 1318.5, 1760.0], 1.6, 2.6)
        return x * env(len(x), 0.015, 0.8) * 0.2
    if kind == "bloom":          # low warm swell, felt more than heard
        t = np.arange(int(0.9 * SR)) / SR
        x = np.sin(2 * np.pi * (110 + 60 * t) * t) + 0.5 * np.sin(2 * np.pi * 220 * t)
        return x * env(len(x), 0.4, 0.45) * 0.28
    if kind == "shimmer":        # glittery high wash for the gold light leak
        n = int(1.0 * SR)
        x = rng.standard_normal(n)
        x = x - lowpass(x, 5000)
        t = np.arange(n) / SR
        x *= 0.6 + 0.4 * np.sin(2 * np.pi * 14 * t)
        return x * env(n, 0.35, 0.55) * 0.18
    if kind == "pad_swell":      # final fade to black: soft chord swell
        t = np.arange(int(1.6 * SR)) / SR
        x = sum(np.sin(2 * np.pi * fr * t) for fr in (220, 277.2, 329.6, 440)) / 4
        return x * env(len(x), 0.6, 0.9) * 0.3
    if kind == "soft_pop":       # rounded pop for badges, never a click
        t = np.arange(int(0.18 * SR)) / SR
        x = np.sin(2 * np.pi * (420 + 260 * np.exp(-t * 30)) * t)
        return x * env(len(x), 0.008, 0.15) * 0.3
    if kind == "tick":           # quiet tick for the counter / cards
        t = np.arange(int(0.06 * SR)) / SR
        x = np.sin(2 * np.pi * 1600 * t) * np.exp(-t * 70)
        return x * env(len(x), 0.002, 0.04) * 0.12
    raise ValueError(kind)


def main():
    cues = json.load(open(sys.argv[1]))
    out, secs = sys.argv[2], float(sys.argv[3])
    buf = np.zeros(int(secs * SR) + SR)
    for c in cues:
        v = voice(c["type"]) * c.get("gain", 1.0)
        s = int(c["t"] * SR)
        e = min(len(buf), s + len(v))
        buf[s:e] += v[: e - s]
    buf = buf[: int(secs * SR)]
    buf = buf / max(1.0, np.abs(buf).max() / 0.9)
    st = np.stack([buf, buf], 1)
    with wave.open(out, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())
    print(f"sfx -> {out} ({len(cues)} cues)")


if __name__ == "__main__":
    main()
