"""
generate-voice-customdomain.py
Voices CustomDomainVideo ("Custom Domain for Your Training Business") with the house
voice from voice_style.py, then patches DURATIONS + VOICED in src/CustomDomainVideo.tsx.

Usage:  bash generate-voice-customdomain.sh          (reads OPENAI_API_KEY from .env)
        REDO=1 bash generate-voice-customdomain.sh   (re-voice every line)
Existing clips are skipped unless REDO=1.
"""
import os, re, json, math, subprocess
from pathlib import Path
from openai import OpenAI
import voice_style as vs   # THE skillBNK voice (shared by every video)

FPS = 30
AUDIO_DIR = Path("public/customdomain")
TSX_PATH = Path("src/CustomDomainVideo.tsx")

ORDER = ["d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7"]

# Spoken text: brand written "skillbank" so TTS pronounces it right.
# Claims verified against the skillBNK code (project doc: skillbnk-code-facts.md).
# All names are fictional (Brightpath Academy, learnbrightpath.com).
SCRIPTS = {
    "d0": "Still sending learners to a long platform address? Let's put your training on your own domain, step by step.",
    "d1": "In skillbank, open the Website Builder. Your site already has free addresses for your website and every portal. Click Set up.",
    "d2": "Type your domain. skillbank shows the exact DNS records you need: one for your website, and one each for your learner, training and admin portals. Copy each record, then save the domain.",
    "d3": "Now add those four records at your domain registrar. Changes usually take a few minutes, and sometimes up to a day.",
    "d4": "Back in skillbank, each address shows its own status. Add the SSL records listed here too, so every address gets a secure certificate.",
    "d5": "Then click Verify. When every host and certificate turns active, you're live.",
    "d6": "Your website card now shows your custom domains. Click Visit, and there it is, on your own address.",
    "d7": "Set up, copy, add, verify. Your domain, on every portal. That's skillbank.",
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
    print("Done. Refresh Remotion Studio → CustomDomainVideo.")


if __name__ == "__main__":
    main()
