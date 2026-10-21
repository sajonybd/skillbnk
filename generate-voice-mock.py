"""
generate-voice-mock.py
Voices MockInterviewVideo (AI Mock Interview feature video) with the house
voice from voice_style.py, then patches DURATIONS + VOICED in src/MockInterviewVideo.tsx.

Usage:  bash generate-voice-mock.sh          (reads OPENAI_API_KEY from .env)
        REDO=1 bash generate-voice-mock.sh   (re-voice every line)
Existing clips are skipped unless REDO=1.
"""
import os, re, json, math, subprocess
from pathlib import Path
from openai import OpenAI
import voice_style as vs   # THE skillBNK voice (shared by every video)

FPS = 30
AUDIO_DIR = Path("public/mock")
TSX_PATH = Path("src/MockInterviewVideo.tsx")

ORDER = ["q0", "q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10", "q11", "q12", "q13"]

# Spoken text: brand written "skillbank" so TTS pronounces it right.
# All names are fictional (Brightline Home Services, Maya Robinson).
SCRIPTS = {
    "q0": "Practicing real customer conversations with every new hire takes hours your managers just don't have.",
    "q1": "In the branch portal, just search mock, or pick Mock Interviews from the sidebar.",
    "q2": "Here's every practice interview your branch runs. Let's add a new one.",
    "q3": ("Choose AI, set the topic and length, add your own questions, "
           "and assign it to a program or to specific people."),
    "q4": "On Maya's side, the new interview is already waiting for her.",
    "q5": "The rules are simple. The AI asks the questions, and she answers out loud, like a real interview.",
    "q6": "A quick checklist helps her get ready.",
    "q7": ("The AI interviewer asks real customer-call questions, listens to her answers, "
           "and follows up, just like a real interviewer would."),
    "q8": "When she's done, it's submitted for review.",
    "q9": "Back at the branch, every submission shows up here.",
    "q10": ("One click on Evaluate by AI scores it and writes the feedback. "
            "Your team adds a quick note, and saves."),
    "q11": "Maya sees her score and feedback, right in her portal.",
    "q12": "And it counts toward her progress, so her branch and head office see it too.",
    "q13": "Create practice interviews once, let AI run them, and review in minutes. That's skillbank.",
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
    print("Done. Refresh Remotion Studio → MockInterviewVideo.")


if __name__ == "__main__":
    main()
