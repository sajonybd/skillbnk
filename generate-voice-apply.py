"""
generate-voice-apply.py
Voices ApplyCompanyVideo ("How to Apply for a Company") with the house
voice from voice_style.py, then patches DURATIONS + VOICED in src/ApplyCompanyVideo.tsx.

Usage:  bash generate-voice-apply.sh          (reads OPENAI_API_KEY from .env)
        REDO=1 bash generate-voice-apply.sh   (re-voice every line)
Existing clips are skipped unless REDO=1.
"""
import os, re, json, math, subprocess
from pathlib import Path
from openai import OpenAI
import voice_style as vs   # THE skillBNK voice (shared by every video)

FPS = 30
AUDIO_DIR = Path("public/apply")
TSX_PATH = Path("src/ApplyCompanyVideo.tsx")

ORDER = ["a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8"]

# Spoken text: brand written "skillbank" so TTS pronounces it right.
# Claims verified against the skillBNK code (project doc: skillbnk-code-facts.md).
# All names are fictional (Northstar Skills Academy, Olivia Hart).
SCRIPTS = {
    "a0": "Ready to bring your training online? Setting up your company on skillbank takes five steps, and just a few minutes.",
    "a1": "Sign in at skillbank dot com, open Companies, and click Apply for Company.",
    "a2": "First, choose your package. Pick a billing cycle, or ask for a custom package if you need something different.",
    "a3": "Next, add your institute's details. Your address, a contact person, your logo, and your business documents.",
    "a4": "Then choose how to pay. Use a card with Stripe, or pick manual payment and get the details in your company dashboard.",
    "a5": "Read the terms, sign right on the screen, and choose where to get your verification code. By text, or by email.",
    "a6": "Enter the six-digit code, and submit your application.",
    "a7": "Your company shows up as pending. Once it's approved, click Explore Company and start setting up.",
    "a8": "Pick a package, add your details, sign, and verify. Then start building on skillbank.",
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
    print("Done. Refresh Remotion Studio → ApplyCompanyVideo.")


if __name__ == "__main__":
    main()
