"""
generate-voice-teamaccess.py
Voices TeamAccessVideo ("Programs, Instructors & Staff") with the house
voice from voice_style.py, then patches DURATIONS + VOICED in src/TeamAccessVideo.tsx.

Usage:  bash generate-voice-teamaccess.sh          (reads OPENAI_API_KEY from .env)
        REDO=1 bash generate-voice-teamaccess.sh   (re-voice every line)
Existing clips are skipped unless REDO=1.
"""
import os, re, json, math, subprocess
from pathlib import Path
from openai import OpenAI
import voice_style as vs   # THE skillBNK voice (shared by every video)

FPS = 30
AUDIO_DIR = Path("public/teamaccess")
TSX_PATH = Path("src/TeamAccessVideo.tsx")

ORDER = ["p0", "p1", "p2", "p3", "p4", "p5", "p6"]

# Spoken text: brand written "skillbank" so TTS pronounces it right.
# Claims verified against the skillBNK code. All names are fictional (Brightpath Academy).
SCRIPTS = {
    "p0": "Someone just deleted your best program. The log says: admin. Problem is, everyone logs in as admin. Most LMS platforms give you one admin login. In skillbank, everyone gets a role, with only the access they need.",
    "p1": "Start with your programs. In Courses and Programs, All Bootcamps shows every program, its pricing, and the locations where it's offered. Not enrollable yet means no location is chosen.",
    "p2": "Click Select branches. On the Branches tab, tick the locations that should offer this program, and save. Now students at those locations can enroll.",
    "p3": "Next, your instructors. Click Add New Instructor, enter their name, email, a short bio, and a photo. Click Add, and they're ready to assign to programs.",
    "p4": "Now decide who can do what. In the Role List, click Add Role, name it Program Coordinator, and switch on only the permissions this role needs. Then click Add.",
    "p5": "Finally, add your staff. Click Add Staff, enter their email, and pick one or more roles. They get an invitation by email, with exactly the access you chose.",
    "p6": "The right people, with the right access. That's skillbank.",
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
    print("Done. Refresh Remotion Studio → TeamAccessVideo.")


if __name__ == "__main__":
    main()
