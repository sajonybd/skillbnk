"""
generate-voice-enrollmentbuilder.py
Voices EnrollmentFormBuilderVideo ("Enrollment Form Builder") with the house
voice from voice_style.py, then patches DURATIONS + VOICED in src/EnrollmentFormBuilderVideo.tsx.

Usage:  bash generate-voice-enrollmentbuilder.sh          (reads OPENAI_API_KEY from .env)
        REDO=1 bash generate-voice-enrollmentbuilder.sh   (re-voice every line)
Existing clips are skipped unless REDO=1.
"""
import os, re, json, math, subprocess
from pathlib import Path
from openai import OpenAI
import voice_style as vs   # THE skillBNK voice (shared by every video)

FPS = 30
AUDIO_DIR = Path("public/enrollmentbuilder")
TSX_PATH = Path("src/EnrollmentFormBuilderVideo.tsx")

ORDER = ["e0", "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", "e10"]

# Spoken text: brand written "skillbank" so TTS pronounces it right.
# Claims verified against the skillBNK code. All names are fictional (Brightpath Academy).
SCRIPTS = {
    "e0": "Every half-finished enrollment is a student you could lose. Most LMS platforms give you one fixed sign-up form. In skillbank, you build your own: your steps, your fields, every answer saved.",
    "e1": "In the company portal, open Enrollment form Builder. A new institute starts with an empty builder, so just click Initiate Now. You instantly get Step 1, with a first row, ready for fields.",
    "e2": "Up top are four buttons: Add New Step, Save, Preview, and Delete. On the right, the Form Elements panel holds fourteen building blocks, from short text to signatures and column layouts.",
    "e3": "Click the edit icon on Step 1, rename it Student Details, and save. Then click Add New Step, name it Guardian Info, and save. Do it once more for Documents. Three steps, ready.",
    "e4": "Fields sit in rows. Click Edit, rename row 1 to Personal Details, and update. Then click Add New Row Here, and add a second row: Contact Details.",
    "e5": "Now drag elements in from the right. Short Text for the student's name. Date for date of birth. Dropdown for the program. And Attachment for a photo ID. Drop each one straight into the row.",
    "e6": "Click any field to set it up. Type the label, add a short description, then fill in the dropdown options. Add New Option adds more. Turn on Required, and save. Rename the other fields the same way.",
    "e7": "Need two fields side by side? Drag in 2 Columns, then drop a Number and a Short Text into each side. To reuse a whole row, click Duplicates. Delete removes it.",
    "e8": "Click Preview to test the form the way a student will. Step by step, with Next and Previous, and Done on the last step. Happy with it? Close the preview, and click Save.",
    "e9": "Once saved, students see the same steps on your enroll page, next to the Order Summary. Every answer is saved with their enrollment. Open the student in Pending Members, and Student Information shows each answer by step, ready to export to CSV or print.",
    "e10": "Your steps, your questions, your enrollment form. Build it once, in skillbank.",
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
    print("Done. Refresh Remotion Studio → EnrollmentFormBuilderVideo.")


if __name__ == "__main__":
    main()
