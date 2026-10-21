"""
generate-voice-portals.py
Voices PortalsVideo (Company → Branch → Learner feature video) with the house
voice from voice_style.py, then patches DURATIONS + VOICED in src/PortalsVideo.tsx.

Usage:  bash generate-voice-portals.sh          (reads OPENAI_API_KEY from .env)
        REDO=1 bash generate-voice-portals.sh   (re-voice every line)
Existing clips are skipped unless REDO=1.
"""
import os, re, json, math, subprocess
from pathlib import Path
from openai import OpenAI
import voice_style as vs   # THE skillBNK voice (shared by every video)

FPS = 30
AUDIO_DIR = Path("public/portals")
TSX_PATH = Path("src/PortalsVideo.tsx")

ORDER = ["k0", "k1", "k2", "k3", "k4", "k5", "k6", "k7", "k8", "k9", "k10"]

# Spoken text: brand written "skillbank" so TTS pronounces it right.
SCRIPTS = {
    "k0": ("Your head office builds the training. Your branches run it their own way. "
           "And nobody can see what learners actually finished."),
    "k1": "Three systems, three logins, and a lot of guessing.",
    "k2": "skillbank connects all three: one company portal, every branch, and every learner.",
    "k3": ("It starts in the company portal. Build a course step by step: basic info, content, media, "
           "pricing, and SEO. Or let AI fill it in, then review it all in one place."),
    "k4": "Next, open the course and go to Branches. Pick where it runs, hit save, and it's sent.",
    "k5": ("Then decide what counts as progress, like lessons, tests, and mock interviews, "
           "so every branch tracks it the same way."),
    "k6": ("Now the branch portal. The manager signs in, picks their branch, "
           "and the course is already there, managed by head office."),
    "k7": ("Branches can also add their own branch-specific lessons, like a local welcome video, "
           "to courses managed by head office."),
    "k8": ("And learners get their own portal. They pick their enrollment, see their branch, "
           "instructor, and progress, then press play."),
    "k9": ("Every finished lesson flows straight back up. Branches see each learner's progress, "
           "and head office can check any branch in its reports."),
    "k10": "Company, branch, learner. Three portals, one connected platform. That's skillbank.",
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
    print("Done. Refresh Remotion Studio → PortalsVideo.")


if __name__ == "__main__":
    main()
