"""
generate-voice-whitelabel.py
Voices WhiteLabelVideo ("White-Label Training Platform") with the house
voice from voice_style.py, then patches DURATIONS + VOICED in src/WhiteLabelVideo.tsx.

Usage:  bash generate-voice-whitelabel.sh          (reads OPENAI_API_KEY from .env)
        REDO=1 bash generate-voice-whitelabel.sh   (re-voice every line)
Existing clips are skipped unless REDO=1.
"""
import os, re, json, math, subprocess
from pathlib import Path
from openai import OpenAI
import voice_style as vs   # THE skillBNK voice (shared by every video)

FPS = 30
AUDIO_DIR = Path("public/whitelabel")
TSX_PATH = Path("src/WhiteLabelVideo.tsx")

ORDER = ["w0", "w1", "w2", "w3", "w4", "w5", "w6"]

# Spoken text: brand written "skillbank" so TTS pronounces it right.
# Claims verified against the skillBNK code (project doc: skillbnk-code-facts.md).
# All names are fictional (Brightpath Academy, learnbrightpath.com).
SCRIPTS = {
    "w0": "Your customers find your course, then sign up on a page with someone else's name on it. What if it was all yours?",
    "w1": "With skillbank, open the Website Builder and create your company website in a few clicks.",
    "w2": "Then build each page your way. Add ready-made blocks and full page templates from the design library, drag sections into place, and edit every text, image and style.",
    "w3": "Set your brand once. Your colors, your fonts, your logos and favicon. Your site updates as you go.",
    "w4": "Next, connect your own domain. Add the DNS records shown, and every portal runs on your domain. Your website, your learner portal, even your admin.",
    "w5": "Now learners visit your site and sign in on your branded login page. Your name, everywhere.",
    "w6": "Your brand. Your domain. Your login. That's skillbank.",
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
    print("Done. Refresh Remotion Studio → WhiteLabelVideo.")


if __name__ == "__main__":
    main()
