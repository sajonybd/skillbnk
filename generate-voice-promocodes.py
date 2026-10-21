"""
generate-voice-promocodes.py
Voices PromoCodesVideo ("Promo Codes") with the house
voice from voice_style.py, then patches DURATIONS + VOICED in src/PromoCodesVideo.tsx.

Usage:  bash generate-voice-promocodes.sh          (reads OPENAI_API_KEY from .env)
        REDO=1 bash generate-voice-promocodes.sh   (re-voice every line)
Existing clips are skipped unless REDO=1.
"""
import os, re, json, math, subprocess
from pathlib import Path
from openai import OpenAI
import voice_style as vs   # THE skillBNK voice (shared by every video)

FPS = 30
AUDIO_DIR = Path("public/promocodes")
TSX_PATH = Path("src/PromoCodesVideo.tsx")

ORDER = ["o0", "o1", "o2", "o3", "o4", "o5", "o6", "o7"]

# Spoken text: brand written "skillbank" so TTS pronounces it right.
# Claims verified against the skillBNK code. All names are fictional (Brightpath Academy).
SCRIPTS = {
    "o0": "Just give them twenty percent off. Then refund it by hand, and track it in a spreadsheet. Most LMS platforms have no real promo codes: no limits, no expiry, no report. In skillbank, one code does it all, right at checkout.",
    "o1": "We start in the company portal. Open Promo Codes. Every code shows its uses, how many are left, and the total discount given. Click Create Promo.",
    "o2": "Give it a title, and the code students will type, like FALL20. Add a short description. Choose percentage or a fixed amount, set the value, and cap the maximum discount.",
    "o3": "Set the expiration date. Limit it to fifty uses in total, and one per student. Then choose Selected, tick Programs, and pick exactly which programs it works on. Save Promo.",
    "o4": "Your code is live. Click it to copy, and share it anywhere.",
    "o5": "Now let's see the action on the learner side. On your enroll page, the student enters the code in the order summary and clicks Apply. The discount and the new total appear instantly. Or share the enroll link with the promo already in it, and it's applied automatically.",
    "o6": "Back in the company portal. Open Report to see every use: the total discount, uses left, the top programs, and exactly who used it.",
    "o7": "Discounts that run themselves. That's skillbank.",
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
        if out.exists() and os.environ.get("REDO") != "1" and k not in os.environ.get("REDO_KEYS", "").split(","):
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
    print("Done. Refresh Remotion Studio → PromoCodesVideo.")


if __name__ == "__main__":
    main()
