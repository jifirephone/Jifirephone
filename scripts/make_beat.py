"""Synthesize an original, energetic beat bed (our own, royalty-free): kick, clap, hats, sub bass, pluck arp in A minor.

Usage: .venv/bin/python scripts/make_beat.py OUT.wav SECONDS [BPM=130] [INTRO_BEATS=4] [OUTRO_SECONDS=3.5]
The first INTRO_BEATS are filtered/light, the last OUTRO_SECONDS drop to a held chord.
"""
import sys, wave
import numpy as np
SR = 48000
out, secs = sys.argv[1], float(sys.argv[2])
bpm = float(sys.argv[3]) if len(sys.argv) > 3 else 130
intro = int(sys.argv[4]) if len(sys.argv) > 4 else 4
outro = float(sys.argv[5]) if len(sys.argv) > 5 else 3.5
N = int(secs * SR); L = np.zeros(N); R = np.zeros(N)
beat = 60 / bpm
rng = np.random.default_rng(7)
def add(buf, t, s, g=1.0):
    i = int(t * SR)
    if i >= N: return
    s = s[: N - i]; buf[i:i + len(s)] += s * g
def kick():
    t = np.arange(int(0.28 * SR)) / SR
    f = 46 + 110 * np.exp(-t * 34)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 11)
def clap():
    t = np.arange(int(0.16 * SR)) / SR
    n = rng.standard_normal(len(t))
    n = np.convolve(n, np.ones(6) / 6, 'same') - np.convolve(n, np.ones(60) / 60, 'same')
    env = np.exp(-t * 26) + 0.6 * np.exp(-np.abs(t - 0.012) * 300) + 0.5 * np.exp(-np.abs(t - 0.024) * 300)
    return n * env * 0.5
def hat(d=0.04):
    t = np.arange(int(d * SR)) / SR
    n = rng.standard_normal(len(t)); n = n - np.convolve(n, np.ones(8) / 8, 'same')
    return n * np.exp(-t * 90) * 0.35
def hz(m): return 440 * 2 ** ((m - 69) / 12)
def bass(m, d):
    t = np.arange(int(d * SR)) / SR
    return (np.sin(2 * np.pi * hz(m) * t) + 0.3 * np.sin(4 * np.pi * hz(m) * t)) * np.minimum(1, t * 200) * np.exp(-t * 3.5)
def pluck(m, d=0.22):
    t = np.arange(int(d * SR)) / SR
    return (np.sin(2 * np.pi * hz(m) * t) + 0.5 * np.sin(2 * np.pi * hz(m) * 2.005 * t)) * np.exp(-t * 16) * 0.5
prog = [(45, [69, 72, 76]), (41, [65, 69, 72]), (36, [67, 72, 76]), (43, [67, 71, 74])]  # Am F C G
nb = int(secs / beat) + 1
body_end = secs - outro
for b in range(nb):
    t = b * beat
    root, tones = prog[(b // 4) % 4]
    if t >= body_end:
        continue
    light = b < intro
    if not light:
        add(L, t, kick(), 0.95); add(R, t, kick(), 0.95)
        if b % 2 == 1:
            c = clap(); add(L, t, c, 0.8); add(R, t + 0.004, c, 0.8)
        for k, off in enumerate([0, 0.75]):
            bs = bass(root, beat * 0.6); add(L, t + off * beat * (k > 0) , bs, 0.5 if k == 0 else 0.32); add(R, t + off * beat * (k > 0), bs, 0.5 if k == 0 else 0.32)
    for h in range(2):
        hh = hat(0.03 if h == 0 else 0.06); add(L, t + h * beat / 2, hh, 0.5 if light else 0.8); add(R, t + h * beat / 2, hh, 0.4 if light else 0.7)
    for k in range(4):
        p = pluck(tones[(k + b) % 3] + (12 if k == 3 else 0))
        g = 0.35 if light else 0.5
        add(L if k % 2 == 0 else R, t + k * beat / 4, p, g); add(R if k % 2 == 0 else L, t + k * beat / 4 + beat / 4 * 0.75, p, g * 0.35)
# outro: last kick + held chord fading
tt = np.arange(int(outro * SR)) / SR
ch = sum(np.sin(2 * np.pi * hz(m) * tt) for m in [45, 57, 60, 64, 69]) * np.exp(-tt * 1.1) * 0.14
add(L, body_end, kick(), 1.0); add(R, body_end, kick(), 1.0); add(L, body_end, ch); add(R, body_end, ch)
mix = np.stack([L, R], 1); mix = np.tanh(mix * 0.9); mix /= max(1e-9, np.abs(mix).max()) / 0.85
w = wave.open(out, 'w'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes()); w.close()
print('beat ->', out, bpm, 'bpm')
