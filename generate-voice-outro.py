"""
generate-voice-outro.py — voices the MAIN OUTRO used by every video.

Uses the house voice from voice_style.py (same as every other clip). Writes
public/outro/skillbnk-outro.mp3 and patches OUTRO_AUDIO + OUTRO_FRAMES in
src/SkillbnkOutroVideo.tsx. Every video reads those values, so all of them
pick up the new outro automatically.

Usage:  bash generate-voice-outro.sh      (reads OPENAI_API_KEY from .env)
"""
import os, re, json, math, subprocess
from pathlib import Path
from openai import OpenAI
import voice_style as vs   # THE skillBNK voice

# Spoken outro line ("skillbank" spelling so TTS pronounces the brand right).
OUTRO_TEXT = "Ready to get started? Talk to us at skillbank dot com slash inquiry."

FPS = 30
MAX_FRAMES = 150          # hard cap: 5 seconds (user rule)
OUT = Path("public/outro/skillbnk-outro.mp3")
TSX = Path("src/SkillbnkOutroVideo.tsx")


def main():
    key = os.environ.get("OPENAI_API_KEY")
    if not key:
        raise RuntimeError("OPENAI_API_KEY not set")
    client = OpenAI(api_key=key)
    OUT.parent.mkdir(parents=True, exist_ok=True)

    print(f"🎙  Main outro — {vs.MODEL} / {vs.VOICE} @ {vs.SPEED}")
    print(f'    "{OUTRO_TEXT}"')
    vs.speak(client, OUTRO_TEXT, OUT)

    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", str(OUT)],
                       capture_output=True, text=True)
    secs = float(json.loads(r.stdout)["format"]["duration"])
    frames = MAX_FRAMES   # always exactly 5s so every video's intro/outro is the same length
    if math.ceil(secs * FPS) + 15 > MAX_FRAMES:
        print(f"  ⚠️  voice is {secs:.2f}s — too long for the 5s cap; shorten the line so it fits")
    print(f"  ✓ {OUT}  ({secs:.2f}s) → OUTRO_FRAMES = {frames}")

    src = TSX.read_text()
    src = re.sub(r'export const OUTRO_AUDIO = "[^"]*";', f'export const OUTRO_AUDIO = "outro/{OUT.name}";', src, count=1)
    src = re.sub(r"export const OUTRO_FRAMES = \d+;", f"export const OUTRO_FRAMES = {frames};", src, count=1)
    TSX.write_text(src)
    print(f"  patched {TSX}")
    print("\n✅  All videos now end with the voiced outro. Refresh Remotion Studio.")


if __name__ == "__main__":
    main()
