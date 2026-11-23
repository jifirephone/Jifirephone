"""Synthesize original cinematic SFX (royalty-free, ours): impact, sub_drop, metal_hit, glitch, ui_click,
rev_riser, whoosh, logo_reveal, sweep. Usage:
  .venv/bin/python scripts/make_sfx_cine.py cues.json OUT.wav SECONDS   # mix cues [{t,type,gain}]
  .venv/bin/python scripts/make_sfx_cine.py --export DIR                 # write each sound as its own wav
"""
import sys, json, wave, os
import numpy as np
SR = 48000
rng = np.random.default_rng(11)
def t_(d): return np.arange(int(d * SR)) / SR
def lp(x, fc):
    a = np.exp(-2 * np.pi * fc / SR); y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x): acc = (1 - a) * v + a * acc; y[i] = acc
    return y
def hp(x, fc): return x - lp(x, fc)
def sweep_noise(d, f0, f1):
    n = rng.standard_normal(int(d * SR)); out = np.zeros_like(n); seg = 512
    for i in range(0, len(n), seg):
        fc = f0 + (f1 - f0) * (i / len(n)); a = np.exp(-2 * np.pi * fc / SR); acc = 0.0
        blk = n[i:i + seg]; o = np.empty_like(blk)
        for j, v in enumerate(blk): acc = (1 - a) * v + a * acc; o[j] = acc
        out[i:i + seg] = o
    return out / (np.abs(out).max() + 1e-9)
def stereo(m, pan=0.0):
    l = m * np.sqrt((1 - pan) / 2); r = m * np.sqrt((1 + pan) / 2); return np.stack([l, r], 1)
def impact():
    t = t_(1.6); f = 38 + 70 * np.exp(-t * 9)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.6)
    n = lp(rng.standard_normal(len(t)), 900) * np.exp(-t * 18) * 2.5
    return stereo(np.tanh((body + n) * 1.4) * 0.9)
def sub_drop():
    t = t_(1.3); f = 120 * np.exp(-t * 1.8) + 30
    return stereo(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, t * 30) * np.exp(-t * 1.6) * 0.9)
def metal_hit():
    t = t_(1.8); parts = [(523, 1.0), (1310, 0.6), (2093, 0.45), (2960, 0.3), (4180, 0.2)]
    s = sum(a * np.sin(2 * np.pi * f * t + i) * np.exp(-t * (2.2 + i * 1.1)) for i, (f, a) in enumerate(parts))
    click = hp(rng.standard_normal(len(t)), 3000) * np.exp(-t * 120) * 0.8
    m = (s * 0.35 + click); return np.stack([m, np.roll(m, 180)], 1) * 0.8
def glitch():
    d = 0.42; n = int(d * SR); m = np.zeros(n); i = 0
    while i < n:
        L = int(rng.integers(600, 2400)); kind = rng.integers(0, 3); tt = np.arange(L) / SR
        if kind == 0: blk = np.sign(np.sin(2 * np.pi * rng.integers(200, 1800) * tt)) * 0.35
        elif kind == 1: blk = np.round(rng.standard_normal(L) * 3) / 3 * 0.3
        else: blk = np.zeros(L)
        m[i:i + L] = blk[: n - i]; i += L
    return stereo(hp(m, 300) * 0.8, float(rng.uniform(-0.4, 0.4)))
def ui_click():
    t = t_(0.09); s = np.sin(2 * np.pi * 2200 * t) * np.exp(-t * 90) + 0.5 * np.sin(2 * np.pi * 4400 * t) * np.exp(-t * 160)
    return stereo(s * 0.6)
def rev_riser():
    d = 1.6; n = sweep_noise(d, 300, 7000); env = np.linspace(0, 1, len(n)) ** 2.4
    t = t_(d); tone = np.sin(2 * np.pi * (200 + 600 * (t / d) ** 2) * t) * 0.25
    m = (n * 0.8 + tone) * env; m[-int(0.03 * SR):] *= np.linspace(1, 0, int(0.03 * SR))
    return stereo(m * 0.8)
def whoosh(pan_dir=1):
    d = 0.6; n = sweep_noise(d, 400, 3500); t = t_(d); env = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.5
    m = n * env; p = np.linspace(-0.8 * pan_dir, 0.8 * pan_dir, len(m))
    return np.stack([m * np.sqrt((1 - p) / 2), m * np.sqrt((1 + p) / 2)], 1) * 0.9
def logo_reveal():
    d = 3.0; t = t_(d); notes = [220, 277.2, 329.6, 440, 554.4, 659.3, 830.6]
    pad = sum(np.sin(2 * np.pi * f * t + i) * (0.5 / (1 + i * 0.3)) for i, f in enumerate(notes))
    env = np.minimum(1, t / 0.4) * np.exp(-t * 0.9)
    sp = hp(rng.standard_normal(len(t)), 6000) * (np.sin(2 * np.pi * 9 * t) > 0.6) * np.exp(-t * 1.4) * 0.25
    m = pad * env * 0.25 + sp; return np.stack([m, np.roll(m, 300)], 1)
def sweep():
    d = 0.9; n = sweep_noise(d, 1500, 300); t = t_(d); env = np.sin(np.pi * t / d) ** 2
    return stereo(n * env * 0.5)
VOICES = {'impact': impact, 'sub_drop': sub_drop, 'metal_hit': metal_hit, 'glitch': glitch, 'ui_click': ui_click,
          'rev_riser': rev_riser, 'whoosh': whoosh, 'whoosh_l': lambda: whoosh(-1), 'logo_reveal': logo_reveal, 'sweep': sweep}
def write(path, x):
    x = x / max(1e-9, np.abs(x).max()) * 0.9 if np.abs(x).max() > 0.99 else x
    w = wave.open(path, 'w'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()
if sys.argv[1] == '--export':
    os.makedirs(sys.argv[2], exist_ok=True)
    for k, f in VOICES.items(): write(os.path.join(sys.argv[2], k + '.wav'), f()); print('->', k)
    sys.exit()
cues = json.load(open(sys.argv[1])); secs = float(sys.argv[3]); out = np.zeros((int(secs * SR), 2)); cache = {}
for c in cues:
    k = c['type']
    if k not in cache: cache[k] = VOICES[k]()
    s = cache[k] * c.get('gain', 1.0); i = int(c['t'] * SR)
    if k == 'rev_riser': i -= len(s)  # rev_riser ends AT t
    j0 = max(0, -i); i = max(0, i); L = min(len(s) - j0, len(out) - i)
    if L > 0: out[i:i + L] += s[j0:j0 + L]
write(sys.argv[2], np.tanh(out * 0.9))
print('cine sfx ->', sys.argv[2], len(cues), 'cues')
