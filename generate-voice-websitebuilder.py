"""
generate-voice-websitebuilder.py
Voices WebsiteBuilderVideo ("Website Builder") with the house
voice from voice_style.py, then patches DURATIONS + VOICED in src/WebsiteBuilderVideo.tsx.

Usage:  bash generate-voice-websitebuilder.sh          (reads OPENAI_API_KEY from .env)
        REDO=1 bash generate-voice-websitebuilder.sh   (re-voice every line)
Existing clips are skipped unless REDO=1.
"""
import os, re, json, math, subprocess
from pathlib import Path
from openai import OpenAI
import voice_style as vs   # THE skillBNK voice (shared by every video)

FPS = 30
AUDIO_DIR = Path("public/websitebuilder")
TSX_PATH = Path("src/WebsiteBuilderVideo.tsx")

ORDER = ["b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "b10"]

# Spoken text: brand written "skillbank" so TTS pronounces it right.
# Claims verified against the skillBNK code (project doc: skillbnk-code-facts.md).
# All names are fictional (Brightpath Academy, learnbrightpath.com).
SCRIPTS = {
    "b0": "Want to change one headline? Open a ticket, and wait nine days. Or build it yourself, in minutes.",
    "b1": "This is the skillbank Website Builder. Along the top: AI, the design library, brand settings, page SEO, preview, save draft, and publish changes.",
    "b2": "On the left are your pages. The global header and footer are shared by every page. Click plus, give your new page a name, and add it.",
    "b3": "Open the library and switch to Pages. Preview a full template like Training Academy, on desktop and on mobile. When you like it, click Use page, and the whole page is ready to edit.",
    "b4": "Need more? Pick a ready-made block like Pricing, and add it with one click. Then drag any component, like a divider, exactly where you want it on the page.",
    "b5": "Click any block to edit it on the right. Change the headline, the highlighted words, and the button text, then fine-tune the style.",
    "b6": "Or let AI build a section for you. Describe what you need, pick a look, and generate. Check the result, click Add to page, and it's on your site, fully editable.",
    "b7": "Edit your global footer once, and every page on your site gets the update.",
    "b8": "Check how it looks on desktop, tablet and mobile. Then set the page's SEO title and description, and see the search preview.",
    "b9": "Save a draft anytime. When you're ready, publish your changes, open it live, and your new page is on your website.",
    "b10": "Pages, blocks, drag and drop, AI, and one-click publishing. Your website, no developer needed. That's skillbank.",
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
    print("Done. Refresh Remotion Studio → WebsiteBuilderVideo.")


if __name__ == "__main__":
    main()
