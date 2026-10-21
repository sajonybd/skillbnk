"""
generate-voice-reelstory.py
Storyteller voice for ReelBulkStoryVideo (vertical Reel). One clip per story beat, house voice "marin"
with a storyteller delivery, then Whisper word timestamps so every on-screen move lands on its word.
Patches DURATIONS, VOICED and WT in src/ReelBulkStoryVideo.tsx.   Run:  bash generate-voice-reelstory.sh  (REDO=1 re-voices)
"""
import os, re, sys, json, math, subprocess, difflib
from pathlib import Path
from openai import OpenAI
import voice_style as vs

FPS = 30
# usage: python3 generate-voice-story.py [src/XxxVideo.tsx] [public/xxxstory]   (defaults = the Bulk reel)
TSX_PATH = Path(sys.argv[1] if len(sys.argv) > 1 else "src/ReelBulkStoryVideo.tsx")
AUDIO_DIR = Path(sys.argv[2] if len(sys.argv) > 2 else "public/reelstory")
SRC0 = TSX_PATH.read_text()
ORDER = re.findall(r'"(\w+)"', re.search(r"const SEGS = \[(.*?)\] as const", SRC0, re.S).group(1))
PAD = {"h0": 16, "d5": 30, "p6": 26}  # default 14 for any other beat; add keys per video   # breathing room after the last word
MIN = {"h0": 200, "p6": 120}  # default 110
LEAD = 2  # TSX plays each clip 2 frames after its beat starts

STORY = ("You are a warm, natural storyteller telling a short, true-to-life story about a busy person in a small training business. "
         "Talk like a real person narrating to a friend, never like an announcer or an ad. Unhurried, conversational pace. "
         "Let sentences breathe: a small pause after each full stop, a beat before 'But' or 'So'. "
         "Mild tension on the first beat, curiosity as the person tries something new, quiet relief on the last line. Not salesy.")
SPEED = 1.0
# optional per-video override: const VOICE_STYLE = "..."; const VOICE_SPEED = 1.05;  (e.g. marketing reels)
_m = re.search(r'const VOICE_STYLE = ("(?:[^"\\]|\\.)*");', SRC0)
if _m: STORY = json.loads(_m.group(1))
_m = re.search(r'const VOICE_SPEED = ([0-9.]+);', SRC0)
if _m: SPEED = float(_m.group(1))
VOICE = "marin"
_m = re.search(r'const VOICE_NAME = "(\w+)";', SRC0)
if _m: VOICE = _m.group(1)


def read_scripts() -> dict:
    src = TSX_PATH.read_text()
    block = re.search(r"const SCRIPTS: Record<Seg, string> = \{(.*?)\n\};", src, re.S).group(1)
    return {m.group(1): json.loads(m.group(2)) for m in re.finditer(r'^\s*(\w+): ("(?:[^"\\]|\\.)*"),?\s*$', block, re.M)}


def dur_seconds(path: Path) -> float:
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", str(path)], capture_output=True, text=True)
    return float(json.loads(r.stdout)["format"]["duration"])


ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split()
TENS = {2: "twenty", 3: "thirty", 4: "forty", 5: "fifty", 6: "sixty"}


def num_words(n: int) -> str:
    if n < 20: return ONES[n]
    return TENS[n // 10] + (ONES[n % 10] if n % 10 else "")


def norm(w: str) -> str:
    w = re.sub(r"[^a-z0-9]", "", w.lower())
    return num_words(int(w)) if w.isdigit() and int(w) <= 69 else w


def speak(client, text, out):
    kw = dict(model="gpt-4o-mini-tts", voice=VOICE, input=text, speed=SPEED, instructions=STORY)
    try:
        speech = client.audio.speech.create(**kw)
    except Exception as e:
        print(f"    ⚠️ {str(e)[:100]}")
        if VOICE != "marin":  # custom voice requested: retry once, never swap to the female house voice silently
            speech = client.audio.speech.create(**kw); speech.write_to_file(out); return
        print("    retrying with the house voice settings")
        vs.speak(client, text, out); return
    speech.write_to_file(out) if hasattr(speech, "write_to_file") else speech.stream_to_file(out)


def whisper_words(client, path):
    with open(path, "rb") as fh:
        r = client.audio.transcriptions.create(model="whisper-1", file=fh, response_format="verbose_json", timestamp_granularities=["word"])
    ws = getattr(r, "words", None) or (r.get("words") if isinstance(r, dict) else None) or []
    return [(w.word if hasattr(w, "word") else w["word"], float(w.start if hasattr(w, "start") else w["start"])) for w in ws]


def align(script_words, heard, total):
    """start second of every script word (difflib match, linear interpolation for the gaps)."""
    a = [norm(w) for w in script_words]
    b = [norm(w) for w, _ in heard]
    t = [None] * len(a)
    for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
        if tag == "equal":
            for k in range(i2 - i1): t[i1 + k] = heard[j1 + k][1]
    known = [(i, v) for i, v in enumerate(t) if v is not None]
    if not known:  # fallback: spread by character count
        tot = sum(len(w) + 2 for w in script_words); acc = 0; out = []
        for w in script_words:
            out.append(total * 0.04 + (total * 0.9) * acc / tot); acc += len(w) + 2
        return out
    for i in range(len(t)):
        if t[i] is None:
            lo = max([(k, v) for k, v in known if k < i], default=(-1, 0.0), key=lambda x: x[0])
            hi = min([(k, v) for k, v in known if k > i], default=(len(t), total), key=lambda x: x[0])
            t[i] = lo[1] + (hi[1] - lo[1]) * (i - lo[0]) / max(1, hi[0] - lo[0])
    return t


def main():
    if not os.environ.get("OPENAI_API_KEY") and Path(".env").exists():  # same .env the generate-voice-*.sh scripts use
        for line in Path(".env").read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                a, b = line.split("=", 1)
                os.environ.setdefault(a.replace("export ", "").strip(), b.strip().strip('"').strip("'"))
    key = os.environ.get("OPENAI_API_KEY")
    if not key: raise RuntimeError("OPENAI_API_KEY not set (add it to .env)")
    client = OpenAI(api_key=key)
    scripts = read_scripts()
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    durations, wt = {}, {}
    for k in ORDER:
        out = AUDIO_DIR / f"{k}.mp3"
        if out.exists() and os.environ.get("REDO") != "1":
            print(f"  {k}.mp3 exists — skipping (REDO=1 to re-voice)")
        else:
            print(f"  voicing {k} …"); speak(client, scripts[k], out)
        secs = dur_seconds(out)
        durations[k] = max(math.ceil(secs * FPS) + PAD.get(k, 14), MIN.get(k, 110))
        words = scripts[k].split()
        try:
            heard = whisper_words(client, out)
            starts = align(words, heard, secs)
        except Exception as e:
            print(f"    ⚠️ whisper failed ({str(e)[:90]}) — using spread timing"); starts = align(words, [], secs)
        wt[k] = [max(0, round(s * FPS)) + LEAD for s in starts]
        print(f"    → {durations[k]} frames, {len(words)} words timed")
    src = TSX_PATH.read_text()
    src = re.sub(r"const DURATIONS: Record<Seg, number> = \{[^}]+\};", "const DURATIONS: Record<Seg, number> = {\n" + "\n".join(f"  {k}: {v}," for k, v in durations.items()) + "\n};", src)
    voiced = ", ".join(f'"{k}"' for k in ORDER if (AUDIO_DIR / f"{k}.mp3").exists())
    src = re.sub(r"const VOICED: string\[\] = \[[^\]]*\];", f"const VOICED: string[] = [{voiced}];", src)
    wtl = "\n".join(f'  {k}: {json.dumps(v)},' for k, v in wt.items())
    src = re.sub(r"// @WT-BEGIN.*?// @WT-END", f"// @WT-BEGIN\nconst WT: Record<string, number[]> = {{\n{wtl}\n}};\n// @WT-END", src, flags=re.S)
    TSX_PATH.write_text(src)
    print(f"\n  patched DURATIONS + VOICED + WT in {TSX_PATH}\nDone. Preview: npx remotion studio  ·  Render: npx remotion render ReelBulkStoryVideo out/ReelBulkStoryVideo.mp4")


if __name__ == "__main__":
    main()
