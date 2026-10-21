"""
generate-voice-change.py
Voices ChangeTrainingVideo ("Roll Out a New Tool to Every Employee") with the house
voice from voice_style.py, then patches DURATIONS + VOICED in src/TrainingFollowUpVideo.tsx.

Usage:  bash generate-voice-change.sh          (reads OPENAI_API_KEY from .env)
        REDO=1 bash generate-voice-change.sh   (re-voice every line)
Existing clips are skipped unless REDO=1.
"""
import os, re, json, math, subprocess
from pathlib import Path
from openai import OpenAI
import voice_style as vs   # THE skillBNK voice (shared by every video)

FPS = 30
AUDIO_DIR = Path("public/change")
TSX_PATH = Path("src/ChangeTrainingVideo.tsx")

ORDER = ["c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9"]

# Spoken text: brand written "skillbank" so TTS pronounces it right.
# Claims verified against the skillBNK code (project doc: skillbnk-code-facts.md).
# All names are fictional (Brookfield Property Management, Leo Grant, Dana Whitfield).
SCRIPTS = {
    "c0": "You bought new software for the whole team. Three months later, half of them still do it the old way.",
    "c1": "With skillbank, describe the change, and AI drafts a short course for it. Chapters, lessons and a quiz.",
    "c2": "Review the structure, generate the lessons, and add them to your course.",
    "c3": "Then enroll the whole team at once. Upload one CSV, check the preview, and click enroll.",
    "c4": "A week later, open the leaderboard and see everyone's completion at a glance.",
    "c5": "Scroll down, and you can see exactly who's falling behind.",
    "c6": "Now send them a reminder. Pick the program and session, keep only the people who still need to finish, and write your message.",
    "c7": "Hit send, check the delivery report, and repeat it every Monday with a scheduled job.",
    "c8": "A week later, the numbers look very different.",
    "c9": "Build it, enroll everyone, and follow up. All in one place. That's skillbank.",
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
    print("Done. Refresh Remotion Studio → ChangeTrainingVideo.")


if __name__ == "__main__":
    main()
