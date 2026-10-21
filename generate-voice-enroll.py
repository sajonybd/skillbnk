"""
generate-voice-enroll.py
Voices EnrollmentFlowVideo ("From Enrollment Form to Active Learner") with the house
voice from voice_style.py, then patches DURATIONS + VOICED in src/EnrollmentFlowVideo.tsx.

Usage:  bash generate-voice-enroll.sh          (reads OPENAI_API_KEY from .env)
        REDO=1 bash generate-voice-enroll.sh   (re-voice every line)
Existing clips are skipped unless REDO=1.
"""
import os, re, json, math, subprocess
from pathlib import Path
from openai import OpenAI
import voice_style as vs   # THE skillBNK voice (shared by every video)

FPS = 30
AUDIO_DIR = Path("public/enroll")
TSX_PATH = Path("src/EnrollmentFlowVideo.tsx")

ORDER = ["e0", "e1", "e2", "e3", "e4", "e5", "e6"]

# Spoken text: brand written "skillbank" so TTS pronounces it right.
# Claims verified against the skillBNK code (project doc: skillbnk-code-facts.md).
# All names are fictional (Keystone Realty Academy, Jordan Ellis).
SCRIPTS = {
    "e0": "Someone wants to join your training. Then come the emails, the spreadsheets, and the copy and paste.",
    "e1": ("As a training provider, build your enrollment form once. Add steps, fields, "
           "and even a signature, right in the Enrollment Form Builder."),
    "e2": ("When someone enrolls in a course, they pick a session and fill in your form, "
           "step by step, right on the course page."),
    "e3": "You get a notification, and the new learner shows up in Pending Members.",
    "e4": "Open their details to see every answer from your form. Set the status to Approved, and click Update.",
    "e5": "Now the course shows as approved in their portal, and they can jump straight in.",
    "e6": "From enrollment form to active learner, all in one place. That's skillbank.",
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
    print("Done. Refresh Remotion Studio → EnrollmentFlowVideo.")


if __name__ == "__main__":
    main()
