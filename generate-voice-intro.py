"""
generate-voice-intro.py — re-voices the MAIN INTRO used by every video.

Uses the same voice setup as the HVAC video (OpenAI gpt-4o-mini-tts, "sage",
same delivery instructions + speed). Writes public/intro/skillbnk-intro.mp3 and
patches INTRO_AUDIO + INTRO_FRAMES in src/SkillbnkIntroVideo.tsx. Every video
reads those values, so all of them pick up the new intro automatically.

Usage:  bash generate-voice-intro.sh      (reads OPENAI_API_KEY from .env)
"""
import os, re, json, math, subprocess
from pathlib import Path
from openai import OpenAI

import voice_style as vs   # THE skillBNK voice — same settings/tone as the HVAC video
MODEL, VOICE = vs.MODEL, vs.VOICE
AUDIENCE = vs.HVAC_AUDIENCE

# Spoken intro line (brand spelled "skillbank" so TTS pronounces it right).
INTRO_TEXT = "skillbank — powering training providers."

FPS = 30
MAX_FRAMES = 150          # hard cap: 5 seconds (user rule)
OUT = Path("public/intro/skillbnk-intro.mp3")
TSX = Path("src/SkillbnkIntroVideo.tsx")


def main():
    key = os.environ.get("OPENAI_API_KEY")
    if not key:
        raise RuntimeError("OPENAI_API_KEY not set")
    client = OpenAI(api_key=key)
    OUT.parent.mkdir(parents=True, exist_ok=True)

    print(f"🎙  Main intro — {MODEL} / {VOICE} (same as HVAC video)")
    print(f'    "{INTRO_TEXT}"')
    vs.speak(client, INTRO_TEXT, OUT, AUDIENCE)

    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", str(OUT)],
                       capture_output=True, text=True)
    secs = float(json.loads(r.stdout)["format"]["duration"])
    frames = MAX_FRAMES   # always exactly 5s so every video's intro/outro is the same length
    if math.ceil(secs * FPS) + 15 > MAX_FRAMES:
        print(f"  ⚠️  voice is {secs:.2f}s — too long for the 5s cap; shorten the line so it fits")
    print(f"  ✓ {OUT}  ({secs:.2f}s) → INTRO_FRAMES = {frames}")

    src = TSX.read_text()
    src = re.sub(r'export const INTRO_AUDIO = "[^"]*";', f'export const INTRO_AUDIO = "intro/{OUT.name}";', src, count=1)
    src = re.sub(r"export const INTRO_FRAMES = \d+;", f"export const INTRO_FRAMES = {frames};", src, count=1)
    TSX.write_text(src)
    print(f"  patched {TSX}")
    print("\n✅  All videos now use the new intro. Refresh Remotion Studio.")


if __name__ == "__main__":
    main()
