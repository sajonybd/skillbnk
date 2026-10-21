"""
generate-voice-formbuilder.py
Voices FormBuilderVideo ("Form Builder") with the house
voice from voice_style.py, then patches DURATIONS + VOICED in src/FormBuilderVideo.tsx.

Usage:  bash generate-voice-formbuilder.sh          (reads OPENAI_API_KEY from .env)
        REDO=1 bash generate-voice-formbuilder.sh   (re-voice every line)
Existing clips are skipped unless REDO=1.
"""
import os, re, json, math, subprocess
from pathlib import Path
from openai import OpenAI
import voice_style as vs   # THE skillBNK voice (shared by every video)

FPS = 30
AUDIO_DIR = Path("public/formbuilder")
TSX_PATH = Path("src/FormBuilderVideo.tsx")

ORDER = ["f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9"]

# Spoken text: brand written "skillbank" so TTS pronounces it right.
# Claims verified against the skillBNK code. All names are fictional (Brightpath Academy).
SCRIPTS = {
    "f0": "Your student data is scattered across five outside tools. Most LMS platforms stop at enrollment, so every other form means another paid tool. In skillbank, every form lives inside your own platform.",
    "f1": "In the company portal, open Form Builder. All Forms lists every form, with its submissions and status at a glance. To build a new one, click Create New.",
    "f2": "The builder has three parts: form elements on the left, your form page in the middle, and properties on the right. Up top: Preview, Test, Export, Import, and Save.",
    "f3": "Click 2 Column Row. Drag Text Input into the left column, and Email into the right. Then add a 1 column row, and drop in a Select Dropdown. Rows and columns keep the layout clean.",
    "f4": "Click an element to select it. On the right, give it a label, Full name, and a placeholder. Then switch on Required, and the canvas updates as you go.",
    "f5": "Long form? Split it into pages. Click Add Tab, name it Your visit, and create it. Then search the elements for rating, and drag it onto the new page.",
    "f6": "Click Test to try the form before you publish. Submit it empty, and required fields are flagged. Fill it in, rate your visit, and Reset clears it all.",
    "f7": "Click Save. Name it Campus Visit Feedback, and set it to Active. Form Options can require sign-in, limit one response per user, allow editing, or send a confirmation email. Then click Save Form.",
    "f8": "Back in All Forms, your new form is active. Copy its link and share it anywhere. People fill in each page and submit. Every submission lands in your responses.",
    "f9": "One builder for every form. Build it, test it, share it, in skillbank.",
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
    print("Done. Refresh Remotion Studio → FormBuilderVideo.")


if __name__ == "__main__":
    main()
