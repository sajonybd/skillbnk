"""
generate-voice-lesson.py
Voices LessonFlowVideo ("Create a Lesson, Present It, Assign It & Track It") with the house
voice from voice_style.py, then patches DURATIONS + VOICED in src/LessonFlowVideo.tsx.

Usage:  bash generate-voice-lesson.sh          (reads OPENAI_API_KEY from .env)
        REDO=1 bash generate-voice-lesson.sh   (re-voice every line)
Existing clips are skipped unless REDO=1.
"""
import os, re, json, math, subprocess
from pathlib import Path
from openai import OpenAI
import voice_style as vs   # THE skillBNK voice (shared by every video)

FPS = 30
AUDIO_DIR = Path("public/lesson")
TSX_PATH = Path("src/LessonFlowVideo.tsx")

ORDER = ["l0", "l1", "l2", "l3", "l4", "l5", "l6", "l7", "l8"]

# Spoken text: brand written "skillbank" so TTS pronounces it right.
# Every claim verified in the skillBNK code (project doc: skillbnk-code-facts.md).
# All names are fictional (Crestview Sales Coaching, Jamie Brooks, Maya Lopez).
SCRIPTS = {
    "l0": "One app to write the lesson, one to present it, one to assign it, and a spreadsheet to track it.",
    "l1": "As a coach, describe your course, and let AI draft the chapters and lessons for you.",
    "l2": "Review the structure, then generate the slides, quizzes and assignments, and add them to your course.",
    "l3": "Fine-tune any slide in the slide editor, then hit Present.",
    "l4": "Teach full screen, right from the platform.",
    "l5": ("Next, create an assignment for your group. AI can suggest the questions, "
           "and answers can be graded automatically."),
    "l6": "Submissions, marks and reviews come back in one list.",
    "l7": "And completed assignments count toward each learner's progress.",
    "l8": "Create, present, assign, and track. All in one place. That's skillbank.",
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
    print("Done. Refresh Remotion Studio → LessonFlowVideo.")


if __name__ == "__main__":
    main()
