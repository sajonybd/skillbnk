"""
generate-voice-formresponses.py
Voices FormResponsesVideo ("Form Responses") with the house
voice from voice_style.py, then patches DURATIONS + VOICED in src/FormResponsesVideo.tsx.

Usage:  bash generate-voice-formresponses.sh          (reads OPENAI_API_KEY from .env)
        REDO=1 bash generate-voice-formresponses.sh   (re-voice every line)
Existing clips are skipped unless REDO=1.
"""
import os, re, json, math, subprocess
from pathlib import Path
from openai import OpenAI
import voice_style as vs   # THE skillBNK voice (shared by every video)

FPS = 30
AUDIO_DIR = Path("public/formresponses")
TSX_PATH = Path("src/FormResponsesVideo.tsx")

ORDER = ["r0", "r1", "r2", "r3", "r4", "r5", "r6", "r7"]

# Spoken text: brand written "skillbank" so TTS pronounces it right.
# Claims verified against the skillBNK code. All names are fictional (Brightpath Academy).
SCRIPTS = {
    "r0": "A parent asks about their answer, and you can't find it. Most tools never keep your answers in one place. In skillbank, every response lands in one table, with a one-click export.",
    "r1": "Someone opens your shared link, fills in the form, and clicks Submit Form. That submission is saved right away as a response.",
    "r2": "In the company portal, open Form Builder. The Submissions column counts every response for each form. In Actions, click View Responses.",
    "r3": "The responses page shows the form name and total responses. Each row has who submitted it, the date, whether they were signed in, and an action to view the full response.",
    "r4": "Click the eye icon to open Full Response Details. At the top: who submitted it, their email, and the date. Below, every answer, grouped by each page of your form.",
    "r5": "Signed In shows Yes when a logged-in learner sends it, and you see their name. Public visitors show No, with their email, or Anonymous when no email is collected.",
    "r6": "Need it in a spreadsheet? Click Export. You get an Excel file, with one column for every field. When you're done, Back to Forms takes you to the list.",
    "r7": "Every answer, in one place. Collect it, read it, export it, in skillbank.",
}


def frames_for_file(path: Path) -> int:
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", str(path)],
                       capture_output=True, text=True)
    return math.ceil(float(json.loads(r.stdout)["format"]["duration"]) * FPS) + 6  # +6f breathing room


def main():
    key = os.environ.get("OPENAI_API_KEY")
    if not key:
        raise RuntimeError("OPENAI_API_KEY not set")
    client = OpenAI(api_key=key)
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)

    print(f"🎙  {vs.MODEL} — voice: {vs.VOICE} @ {vs.SPEED}\n")
    durations = {}
    for k in ORDER:
        out = AUDIO_DIR / f"{k}.mp3"
        if out.exists() and os.environ.get("REDO") != "1":
            print(f"  {k}.mp3 exists — skipping")
        else:
            print(f"  generating {k}.mp3 …")
            vs.speak(client, SCRIPTS[k], out)
        durations[k] = frames_for_file(out)
        print(f"    → {durations[k]} frames")

    src = TSX_PATH.read_text()
    block = "const DURATIONS = {\n" + "\n".join(f"  {k}: {v}," for k, v in durations.items()) + "\n};"
    src = re.sub(r"const DURATIONS = \{[^}]+\};", block, src)
    voiced = ", ".join(f'"{k}"' for k in ORDER if (AUDIO_DIR / f"{k}.mp3").exists())
    src = re.sub(r"const VOICED: string\[\] = \[[^\]]*\];", f"const VOICED: string[] = [{voiced}];", src)
    TSX_PATH.write_text(src)
    print(f"\n  patched DURATIONS + VOICED in {TSX_PATH}")
    print("Done. Refresh Remotion Studio → FormResponsesVideo.")


if __name__ == "__main__":
    main()
