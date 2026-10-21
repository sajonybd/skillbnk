"""make_sfx.py — synthesizes the sound-design kit + grain + soft music bed for ReelBulkStoryVideo.
Output: public/story/sfx/*.wav, public/story/grain.png, public/story/music.wav  (no downloads, all original)."""
import numpy as np, wave, os, sys
from scipy.signal import butter, lfilter
SR = 44100
out = sys.argv[1] if len(sys.argv) > 1 else "public/story"
os.makedirs(f"{out}/sfx", exist_ok=True)
rng = np.random.default_rng(7)

def save(name, x, vol=0.9):
    x = np.asarray(x, dtype=np.float64)
    m = np.max(np.abs(x)) or 1
    x = x / m * vol
    with wave.open(name, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())

def t(d): return np.arange(int(SR * d)) / SR
def env(n, a=0.002, r=0.05):
    e = np.ones(n); na = max(1, int(SR * a)); nr = max(1, int(SR * r))
    e[:na] = np.linspace(0, 1, na); e[-nr:] *= np.linspace(1, 0, nr); return e
def bp(x, lo, hi, order=2):
    b, a = butter(order, [lo / (SR / 2), hi / (SR / 2)], btype="band"); return lfilter(b, a, x)
def lp(x, f, order=2):
    b, a = butter(order, f / (SR / 2), btype="low"); return lfilter(b, a, x)
def hp(x, f, order=2):
    b, a = butter(order, f / (SR / 2), btype="high"); return lfilter(b, a, x)

# typing key ticks (3 variations)
for i, f0 in enumerate([2400, 3100, 2750]):
    x = t(0.045); n = rng.standard_normal(len(x))
    k = bp(n, f0 * 0.6, f0 * 1.6) * np.exp(-x * 140) + 0.4 * np.sin(2 * np.pi * (180 + i * 25) * x) * np.exp(-x * 90)
    save(f"{out}/sfx/key{i}.wav", k, 0.8)
# mouse click: down + up
x = t(0.12); n = rng.standard_normal(len(x))
c = bp(n, 1800, 5200) * np.exp(-x * 220); x2 = np.roll(c, int(0.05 * SR)) * 0.5
save(f"{out}/sfx/click.wav", c + x2 + 0.3 * np.sin(2 * np.pi * 900 * x) * np.exp(-x * 120), 0.85)
# pop
x = t(0.14); f = 520 * np.exp(-x * 14) + 160
save(f"{out}/sfx/pop.wav", np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 30) * env(len(x), 0.001, 0.02), 0.8)
# soft ding (checks)
x = t(0.5); d = (np.sin(2 * np.pi * 1568 * x) + 0.3 * np.sin(2 * np.pi * 3136 * x)) * np.exp(-x * 11)
save(f"{out}/sfx/ding.wav", d * env(len(x), 0.001, 0.05), 0.7)
# whoosh (long/short)
for name, d, f1, f2 in [("whoosh", 0.7, 300, 5200), ("whoosh_s", 0.38, 500, 6500)]:
    x = t(d); n = rng.standard_normal(len(x)); out_ = np.zeros(len(x)); blocks = 24
    for b in range(blocks):
        a, e = int(len(x) * b / blocks), int(len(x) * (b + 1) / blocks)
        fc = f1 * (f2 / f1) ** (b / blocks); out_[a:e] = bp(n, fc * 0.6, min(fc * 1.5, 20000))[a:e]
    sh = np.sin(np.pi * np.linspace(0, 1, len(x))) ** 1.6
    save(f"{out}/sfx/{name}.wav", out_ * sh, 0.8)
# impact / thud
x = t(0.9); n = rng.standard_normal(len(x))
th = np.sin(2 * np.pi * (95 * np.exp(-x * 5) + 38) * x) * np.exp(-x * 7) + lp(n, 400) * np.exp(-x * 18) * 0.7
save(f"{out}/sfx/thud.wav", th, 0.95)
# success chime (maj7 arpeggio)
x = t(1.8); ch = np.zeros(len(x))
for i, fr in enumerate([784, 988, 1175, 1568]):
    s = int(i * 0.07 * SR); xx = x[: len(x) - s]
    ch[s:] += (np.sin(2 * np.pi * fr * xx) + 0.25 * np.sin(2 * np.pi * fr * 2 * xx)) * np.exp(-xx * 3.2) * 0.6
save(f"{out}/sfx/chime.wav", ch, 0.8)
# riser
x = t(2.0); n = rng.standard_normal(len(x)); r = hp(n, 1500) * np.linspace(0.05, 1, len(x)) ** 2.2
r += np.sin(2 * np.pi * np.cumsum(180 + 900 * np.linspace(0, 1, len(x)) ** 2) / SR) * np.linspace(0, 0.5, len(x)) ** 2
save(f"{out}/sfx/riser.wav", r * env(len(x), 0.01, 0.03), 0.7)
# paper / slide swish
x = t(0.3); n = rng.standard_normal(len(x))
save(f"{out}/sfx/swish.wav", bp(n, 2500, 9000) * np.sin(np.pi * np.linspace(0, 1, len(x))) ** 2, 0.6)
# ambient music bed: warm pad chords + soft pulse, 32 s seamless loop
dur = 32.0; x = t(dur); chords = [[220.0, 261.63, 329.63], [174.61, 220.0, 261.63], [261.63, 329.63, 392.0], [196.0, 246.94, 293.66]]
m = np.zeros(len(x)); per = dur / 8
for ci in range(8):
    ch_ = chords[ci % 4]; a, e = int(ci * per * SR), int((ci + 1) * per * SR); xx = x[a:e] - x[a]
    seg = np.zeros(len(xx))
    for fr in ch_:
        for det in (-0.4, 0.0, 0.4):
            seg += np.sin(2 * np.pi * (fr + det) * xx) + 0.3 * np.sin(2 * np.pi * (fr * 2 + det) * xx)
    seg += 0.8 * np.sin(2 * np.pi * (ch_[0] / 2) * xx)
    sw = np.minimum(1, np.minimum(xx / 1.2, (per - xx) / 1.2)); m[a:e] += lp(seg, 1400) * sw
beat = np.zeros(len(x))
for i in range(int(dur / 0.5)):
    s = int(i * 0.5 * SR); k = t(0.25); beat[s:s + len(k)] += (np.sin(2 * np.pi * 60 * k) * np.exp(-k * 12))[: len(beat) - s] * (1 if i % 2 == 0 else 0.45)
pluck = np.zeros(len(x)); notes = [523.25, 659.25, 783.99, 659.25]
for i in range(int(dur / 0.5)):
    if i % 2 == 1:
        s = int(i * 0.5 * SR); k = t(0.6); fr = notes[(i // 2) % 4] * (1 if (i // 8) % 2 == 0 else 0.75)
        pluck[s:s + len(k)] += (np.sin(2 * np.pi * fr * k) * np.exp(-k * 7))[: len(pluck) - s] * 0.5
mix = m / np.max(np.abs(m)) * 0.55 + beat * 0.5 + pluck * 0.22
fade = int(SR * 0.05); mix[:fade] *= np.linspace(0, 1, fade); mix[-fade:] *= np.linspace(1, 0, fade)
save(f"{out}/music.wav", mix, 0.8)
# film grain tile
try:
    from PIL import Image
    g = (rng.standard_normal((1920, 1080)) * 48 + 128).clip(0, 255).astype(np.uint8)
    Image.fromarray(g, "L").save(f"{out}/grain.png")
except Exception as e:
    print("grain skipped", e)
print("ok")
