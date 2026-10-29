"""
generate-voice-free.py — FREE voice (Microsoft neural voices via edge-tts, no API key, no credits).
Same job as generate-voice-story.py: one clip per beat, word timings so on-screen moves land on their word,
then patches DURATIONS, VOICED and WT in the .tsx.

Setup once:   pip3 install edge-tts
Run:          python3 generate-voice-free.py src/NotificationsStoryVideo.tsx public/notifstory
Re-voice:     REDO=1 python3 generate-voice-free.py ...      Change voice: VOICE=en-US-AndrewNeural python3 ...
Good voices:  en-US-AvaNeural (default, warm female), en-US-AndrewNeural (warm male), en-US-EmmaNeural, en-US-BrianNeural
"""
import os, re, sys, json, math, asyncio, subprocess, difflib
from pathlib import Path

try:
    import edge_tts
except ImportError:
    sys.exit("edge-tts is not installed. Run:  pip3 install edge-tts")

FPS = 30
TSX_PATH = Path(sys.argv[1] if len(sys.argv) > 1 else "src/NotificationsStoryVideo.tsx")
AUDIO_DIR = Path(sys.argv[2] if len(sys.argv) > 2 else "public/notifstory")
VOICE = os.environ.get("VOICE", "en-US-AvaNeural")
RATE = os.environ.get("RATE", "+4%")          # a touch faster than default, like the house 1.12 pace
SRC0 = TSX_PATH.read_text()
ORDER = re.findall(r'"(\w+)"', re.search(r"const SEGS = \[(.*?)\] as const", SRC0, re.S).group(1))
PAD = {"h0": 16}
MIN = {"h0": 200}
LEAD = 2


def read_scripts():
    src = TSX_PATH.read_text()
    block = re.search(r"const SCRIPTS: Record<Seg, string> = \{(.*?)\n\};", src, re.S).group(1)
    return {m.group(1): json.loads(m.group(2)) for m in re.finditer(r'^\s*(\w+): ("(?:[^"\\]|\\.)*"),?\s*$', block, re.M)}


def dur_seconds(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", str(path)], capture_output=True, text=True)
    return float(json.loads(r.stdout)["format"]["duration"])


ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split()
TENS = {2: "twenty", 3: "thirty", 4: "forty", 5: "fifty", 6: "sixty"}
def num_words(n): return ONES[n] if n < 20 else TENS[n // 10] + (ONES[n % 10] if n % 10 else "")
def norm(w):
    w = re.sub(r"[^a-z0-9]", "", w.lower())
    return num_words(int(w)) if w.isdigit() and int(w) <= 69 else w


async def speak(text, out):
    """write mp3, return [(word, start_seconds)] from the word-boundary events"""
    try:
        comm = edge_tts.Communicate(text, VOICE, rate=RATE, boundary="WordBoundary")
    except TypeError:  # older edge-tts: word boundaries are the default
        comm = edge_tts.Communicate(text, VOICE, rate=RATE)
    words, audio = [], bytearray()
    async for chunk in comm.stream():
        if chunk["type"] == "audio":
            audio.extend(chunk["data"])
        elif chunk["type"] == "WordBoundary":
            words.append((chunk["text"], chunk["offset"] / 1e7))
    Path(out).write_bytes(bytes(audio))
    return words


def align(script_words, heard, total):
    a = [norm(w) for w in script_words]
    b = [norm(w) for w, _ in heard]
    t = [None] * len(a)
    for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
        if tag == "equal":
            for k in range(i2 - i1): t[i1 + k] = heard[j1 + k][1]
    known = [(i, v) for i, v in enumerate(t) if v is not None]
    if not known:
        tot = sum(len(w) + 2 for w in script_words); acc = 0; out = []
        for w in script_words:
            out.append(total * 0.04 + total * 0.9 * acc / tot); acc += len(w) + 2
        return out
    for i in range(len(t)):
        if t[i] is None:
            lo = max([(k, v) for k, v in known if k < i], default=(-1, 0.0), key=lambda x: x[0])
            hi = min([(k, v) for k, v in known if k > i], default=(len(t), total), key=lambda x: x[0])
            t[i] = lo[1] + (hi[1] - lo[1]) * (i - lo[0]) / max(1, hi[0] - lo[0])
    return t


def main():
    scripts = read_scripts()
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    cache = AUDIO_DIR / "_words.json"
    words_cache = json.loads(cache.read_text()) if cache.exists() else {}
    durations, wt = {}, {}
    for k in ORDER:
        out = AUDIO_DIR / f"{k}.mp3"
        if out.exists() and os.environ.get("REDO") != "1" and k in words_cache:
            print(f"  {k}.mp3 exists — skipping (REDO=1 to re-voice)")
            heard = [tuple(x) for x in words_cache[k]]
        else:
            print(f"  voicing {k} with {VOICE} …")
            heard = asyncio.run(speak(scripts[k], out))
            words_cache[k] = heard
        secs = dur_seconds(out)
        durations[k] = max(math.ceil(secs * FPS) + PAD.get(k, 14), MIN.get(k, 110))
        words = scripts[k].split()
        starts = align(words, heard, secs)
        wt[k] = [max(0, round(s * FPS)) + LEAD for s in starts]
        print(f"    → {durations[k]} frames, {len(heard)} words timed")
    cache.write_text(json.dumps(words_cache))
    src = TSX_PATH.read_text()
    src = re.sub(r"const DURATIONS: Record<Seg, number> = \{[^}]+\};", "const DURATIONS: Record<Seg, number> = {\n" + "\n".join(f"  {k}: {v}," for k, v in durations.items()) + "\n};", src)
    voiced = ", ".join(f'"{k}"' for k in ORDER if (AUDIO_DIR / f"{k}.mp3").exists())
    src = re.sub(r"const VOICED: string\[\] = \[[^\]]*\];", f"const VOICED: string[] = [{voiced}];", src)
    wtl = "\n".join(f'  {k}: {json.dumps(v)},' for k, v in wt.items())
    src = re.sub(r"// @WT-BEGIN.*?// @WT-END", f"// @WT-BEGIN\nconst WT: Record<string, number[]> = {{\n{wtl}\n}};\n// @WT-END", src, flags=re.S)
    TSX_PATH.write_text(src)
    print(f"\n  patched DURATIONS + VOICED + WT in {TSX_PATH}\nDone. Render with: npx remotion render <Composition> out/<name>.mp4")


if __name__ == "__main__":
    main()
