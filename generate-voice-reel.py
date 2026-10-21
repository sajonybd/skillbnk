"""
generate-voice-reel.py
Voices ReelBulkEnrollVideo (vertical Reel) with the house voice, then patches
DURATIONS + VOICED in src/ReelBulkEnrollVideo.tsx.
Usage:  bash generate-voice-reel.sh   (REDO=1 to re-voice every line)
"""
import os, re, json, math, subprocess
from pathlib import Path
from openai import OpenAI
import voice_style as vs

FPS = 30
AUDIO_DIR = Path("public/reel")
TSX_PATH = Path("src/ReelBulkEnrollVideo.tsx")
ORDER = ["v0", "v1", "v2", "v3", "v4", "v5"]
# Minimum scene length (frames): the animations need at least this long even if the voice is shorter.
MINS = {"v0": 270, "v1": 200, "v2": 210, "v3": 230, "v4": 150, "v5": 140}

# Spoken brand = "skillbank". Claims match the Bulk Enrollment page in the code.
SCRIPTS = {
    "v0": "Forty-eight new hires. And you're typing them in, one name at a time? That's an afternoon gone.",
    "v1": "With skillbank, download the template. Email, program, session, first name, last name. Fill it in once.",
    "v2": "Upload it, match your columns to the fields, and skillbank validates every row before anything happens.",
    "v3": "Then preview. Anyone already enrolled is flagged, and everyone else is ready. Click enroll, and the whole team is queued.",
    "v4": "New users get their login details by email, so nobody's waiting on you.",
    "v5": "Forty-eight people. One upload. No typing. That's skillbank.",
}


def frames_for_file(path: Path) -> int:
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", str(path)],
                       capture_output=True, text=True)
    return math.ceil(float(json.loads(r.stdout)["format"]["duration"]) * FPS) + 6


def main():
    key = os.environ.get("OPENAI_API_KEY")
    if not key:
        raise RuntimeError("OPENAI_API_KEY not set")
    client = OpenAI(api_key=key)
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    durations = {}
    for k in ORDER:
        out = AUDIO_DIR / f"{k}.mp3"
        if out.exists() and os.environ.get("REDO") != "1":
            print(f"  {k}.mp3 exists — skipping")
        else:
            print(f"  generating {k}.mp3 …")
            vs.speak(client, SCRIPTS[k], out)
        durations[k] = max(frames_for_file(out), MINS[k])
        print(f"    → {durations[k]} frames")

    src = TSX_PATH.read_text()
    block = "const DURATIONS = {\n" + "\n".join(f"  {k}: {v}," for k, v in durations.items()) + "\n};"
    src = re.sub(r"const DURATIONS = \{[^}]+\};", block, src)
    voiced = ", ".join(f'"{k}"' for k in ORDER if (AUDIO_DIR / f"{k}.mp3").exists())
    src = re.sub(r"const VOICED: string\[\] = \[[^\]]*\];", f"const VOICED: string[] = [{voiced}];", src)
    TSX_PATH.write_text(src)
    print(f"\n  patched DURATIONS + VOICED in {TSX_PATH}\nDone. Render: npx remotion render ReelBulkEnrollVideo out/ReelBulkEnrollVideo.mp4")


if __name__ == "__main__":
    main()
