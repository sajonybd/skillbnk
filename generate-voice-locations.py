"""
generate-voice-locations.py
Voices ManageLocationsVideo ("Manage Multiple Locations") with the house
voice from voice_style.py, then patches DURATIONS + VOICED in src/ManageLocationsVideo.tsx.

Usage:  bash generate-voice-locations.sh          (reads OPENAI_API_KEY from .env)
        REDO=1 bash generate-voice-locations.sh   (re-voice every line)
Existing clips are skipped unless REDO=1.
"""
import os, re, json, math, subprocess
from pathlib import Path
from openai import OpenAI
import voice_style as vs   # THE skillBNK voice (shared by every video)

FPS = 30
AUDIO_DIR = Path("public/locations")
TSX_PATH = Path("src/ManageLocationsVideo.tsx")

ORDER = ["m0", "m1", "m2", "m3", "m4", "m5", "m6", "m7"]

# Spoken text: brand written "skillbank" so TTS pronounces it right.
# Claims verified against the skillBNK code. All names are fictional (Brightpath Academy).
SCRIPTS = {
    "m0": "Four locations. Four spreadsheets. And zero idea which one is losing students. With most LMS platforms, every location is its own island. In skillbank, one head office sees every location, live.",
    "m1": "In the company portal, open Branch Management. All Branches lists every location, with its name, short name, web address, who created it, and its status.",
    "m2": "To add a location, click Add New Branch. Step one: the name, web address, phone, fax and tax numbers. Then the full address: street, city, state, postal code, and country. Click Next.",
    "m3": "Step two: the primary contact person. Name, email and phone. Step three: a secondary contact, so someone is always reachable.",
    "m4": "Step four: describe the location, and add its social media links. Step five: upload the logo and the business documents. Then click Create Branch.",
    "m5": "The new location appears in the list as Pending, until it's approved. Approved locations are live. To see how any location is doing, click the eye icon.",
    "m6": "Each location gets its own summary: approved students, transactions, and the total amount. A chart shows the last twelve months, and below are the location's details and contacts.",
    "m7": "Every location, one head office. That's skillbank.",
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
    print("Done. Refresh Remotion Studio → ManageLocationsVideo.")


if __name__ == "__main__":
    main()
