"""
generate-voice-integrations.py
Voices IntegrationsVideo ("Integrations") with the house
voice from voice_style.py, then patches DURATIONS + VOICED in src/IntegrationsVideo.tsx.

Usage:  bash generate-voice-integrations.sh          (reads OPENAI_API_KEY from .env)
        REDO=1 bash generate-voice-integrations.sh   (re-voice every line)
Existing clips are skipped unless REDO=1.
"""
import os, re, json, math, subprocess
from pathlib import Path
from openai import OpenAI
import voice_style as vs   # THE skillBNK voice (shared by every video)

FPS = 30
AUDIO_DIR = Path("public/integrations")
TSX_PATH = Path("src/IntegrationsVideo.tsx")

ORDER = ["i0", "i1", "i2", "i3", "i4", "i5", "i6", "i6b", "i7"]

# Spoken text: brand written "skillbank" so TTS pronounces it right.
# Claims verified against the skillBNK code. All names are fictional (Brightpath Academy).
SCRIPTS = {
    "i0": "Friday night. Your payment key just expired, and enrollments are failing all weekend. Most LMS platforms lock you into their providers. In skillbank, you connect your own accounts, and test them all in one click.",
    "i1": "In the company portal, open Integrations. Every connection has its own tab: ChatGPT, Zoom, SendGrid, Twilio, Vimeo, and payment methods.",
    "i2": "For AI, paste your ChatGPT API key, and choose which locations can use it. Pick a model, like GPT-4o mini, switch it on, and save. Then test the connection.",
    "i3": "For live classes, add a Zoom account. Enter the title, account ID, client ID and client secret from the Zoom Marketplace, choose the locations, and save.",
    "i4": "SendGrid sends your emails from verified sender addresses. Twilio sends text messages from your own numbers. Add each one, choose the locations, and save.",
    "i5": "For payments, choose PayPal, Square, Stripe, or your own custom method. For Stripe, add a title and your secret key, pick which locations take card payments, and save.",
    "i6": "Click Check connections. A red dot flags anything that needs attention. Open it, update the setting, save, and test the connection again.",
    "i6b": "And every connection is set per location. Downtown takes cards with Stripe, Eastside uses PayPal and Twilio, and Northgate gets its own Zoom and Square. Each location gets exactly what it needs.",
    "i7": "Your accounts, connected in one place. That's skillbank.",
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
    print("Done. Refresh Remotion Studio → IntegrationsVideo.")


if __name__ == "__main__":
    main()
