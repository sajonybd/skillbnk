"""
generate-voice-realestate.py
Voices RealEstateTrainingVideo ("Onboard New Real Estate Agents") with the house
voice from voice_style.py, then patches DURATIONS + VOICED in src/TrainingFollowUpVideo.tsx.

Usage:  bash generate-voice-realestate.sh          (reads OPENAI_API_KEY from .env)
        REDO=1 bash generate-voice-realestate.sh   (re-voice every line)
Existing clips are skipped unless REDO=1.
"""
import os, re, json, math, subprocess
from pathlib import Path
from openai import OpenAI
import voice_style as vs   # THE skillBNK voice (shared by every video)

FPS = 30
AUDIO_DIR = Path("public/realestate")
TSX_PATH = Path("src/RealEstateTrainingVideo.tsx")

ORDER = ["r0", "r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8"]

# Spoken text: brand written "skillbank" so TTS pronounces it right.
# Claims verified against the skillBNK code (project doc: skillbnk-code-facts.md).
# All names are fictional (Harborview Realty Group, Jessica Moore, Karen Wells).
SCRIPTS = {
    "r0": "Your new agent just lost a listing. Not because they're bad, but because nobody had time to teach them your process.",
    "r1": "With skillbank, create your onboarding course once, and choose which offices get it. Austin, San Antonio, Houston.",
    "r2": "Then describe what new agents need to learn. AI drafts the chapters, lessons and quizzes for you.",
    "r3": "Review the structure, generate the lessons, and add them to your course.",
    "r4": "New class of agents? Upload one CSV, check the preview, and enroll everyone at once.",
    "r5": "The leaderboard shows every agent's progress at a glance.",
    "r6": "Scroll down, and you can see exactly who needs a little coaching.",
    "r7": "When an agent finishes, check their progress, pick a certificate template, and generate it in a few clicks.",
    "r8": "Every office. Every agent. One standard. That's skillbank.",
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
    print("Done. Refresh Remotion Studio → RealEstateTrainingVideo.")


if __name__ == "__main__":
    main()
