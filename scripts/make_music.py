"""Synthesize a royalty-free, low-key cinematic music bed (A minor, 96 BPM).

Usage: .venv/bin/python scripts/make_music.py OUT.wav SECONDS
Soft detuned pads (Am-F-C-G), sub bass, gentle kick and ticks. Mixed low; ducked under voice later.
"""
import sys
import wave

import numpy as np

SR = 48000
BPM = 96
BEAT = 60 / BPM
CHORDS = [  # (root midi, chord tones)
    (57, [57, 60, 64, 69]),  # Am
    (53, [53, 57, 60, 65]),  # F
    (48, [55, 60, 64, 67]),  # C
    (55, [55, 59, 62, 67]),  # G
]


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def lowpass(x, cutoff):
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):  # one-pole; fine for a short bed
        acc = (1 - a) * v + a * acc
        y[i] = acc
    return y


def main():
    out, secs = sys.argv[1], float(sys.argv[2])
    n = int(secs * SR)
    t = np.arange(n) / SR
    bar = 4 * BEAT
    pad = np.zeros(n)
    bass = np.zeros(n)
    for i in range(int(secs / bar) + 1):
        root, notes = CHORDS[i % 4]
        s, e = int(i * bar * SR), min(n, int((i + 1) * bar * SR))
        if s >= n:
            break
        tt = t[s:e] - t[s]
        env = np.minimum(1, tt / 0.6) * np.minimum(1, (bar - tt) / 0.4)
        for m in notes:
            for det in (-0.08, 0.0, 0.08):
                ph = 2 * np.pi * hz(m + det) * tt
                pad[s:e] += env * (2 * ((ph / (2 * np.pi)) % 1) - 1) * 0.05
        bass[s:e] += env * np.sin(2 * np.pi * hz(root - 12) * tt) * 0.35
    pad = lowpass(pad, 1400)
    kick = np.zeros(n)
    tick = np.zeros(n)
    rng = np.random.default_rng(7)
    for k in range(int(secs / BEAT)):
        s = int(k * BEAT * SR)
        L = min(int(0.25 * SR), n - s)
        if L <= 0:
            break
        tt = np.arange(L) / SR
        kick[s:s + L] += np.sin(2 * np.pi * (45 + 90 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 14) * 0.5
        s2 = int((k + 0.5) * BEAT * SR)
        L2 = min(int(0.05 * SR), n - s2)
        if L2 > 0:
            nz = rng.standard_normal(L2)
            nz = nz - lowpass(nz, 6000)
            tick[s2:s2 + L2] += nz * np.exp(-np.arange(L2) / SR * 80) * 0.06
    mix = pad + bass + kick + tick
    fade = np.minimum(1, t / 1.5) * np.minimum(1, (secs - t) / 1.5)
    mix = mix * fade
    mix = mix / (np.abs(mix).max() + 1e-9) * 0.7
    st = np.stack([mix, mix], 1)
    # slight stereo width on the pad
    st[:, 0] += np.roll(pad, 240) * 0.15
    st[:, 1] -= np.roll(pad, 240) * 0.15
    st = np.clip(st, -1, 1)
    with wave.open(out, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())
    print("music ->", out)


if __name__ == "__main__":
    main()
