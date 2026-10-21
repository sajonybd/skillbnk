"""
generate-voice-sales.py
Voices SalesPlaybookVideo ("Turn Your Sales Playbook into Training") with the house
voice from voice_style.py, then patches DURATIONS + VOICED in src/TrainingFollowUpVideo.tsx.

Usage:  bash generate-voice-sales.sh          (reads OPENAI_API_KEY from .env)
        REDO=1 bash generate-voice-sales.sh   (re-voice every line)
Existing clips are skipped unless REDO=1.
"""
import os, re, json, math, subprocess
from pathlib import Path
from openai import OpenAI
import voice_style as vs   # THE skillBNK voice (shared by every video)

FPS = 30
AUDIO_DIR = Path("public/sales")
TSX_PATH = Path("src/SalesPlaybookVideo.tsx")

ORDER = ["s0", "s1", "s2", "s3", "s4", "s5", "s6", "s7"]

# Spoken text: brand written "skillbank" so TTS pronounces it right.
# Claims verified against the skillBNK code (project doc: skillbnk-code-facts.md).
# All names are fictional (Crestline Solar, Ryan Ortiz, Megan Hart).
SCRIPTS = {
    "s0": "Your best sales script lives in one rep's head. Everyone else is guessing on every call.",
    "s1": "With skillbank, upload your sales playbook as a PDF. AI reads it and drafts the chapters and lessons for you.",
    "s2": "Review the structure, generate the lessons, and add them to your course.",
    "s3": "Then create an AI mock interview. Set the scenario, and add the questions your reps hear every day.",
    "s4": "Reps practice the call out loud. The AI answers like a real buyer, and asks follow-up questions.",
    "s5": "You review every call. AI suggests a score and feedback, and you add your own comment.",
    "s6": "And the leaderboard shows every rep's progress, so you know who's ready.",
    "s7": "Write it once. Practice it every day. That's skillbank.",
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
    print("Done. Refresh Remotion Studio → SalesPlaybookVideo.")


if __name__ == "__main__":
    main()
