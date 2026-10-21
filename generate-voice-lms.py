"""
generate-voice-lms.py
Generates OpenAI TTS audio for LMSProblemVideo, then patches Root.tsx
with the real frame durations — scoped to the LMSProblemVideo block only.

Usage (called by generate-voice-lms.sh):
  OPENAI_API_KEY=sk-... python3 generate-voice-lms.py
"""

import os, re, json, math, subprocess, textwrap
from pathlib import Path
from openai import OpenAI
import voice_style as vs   # THE skillBNK voice (shared by every video)

# ── Config ────────────────────────────────────────────────────────────────────
FPS          = 30
VOICE        = vs.VOICE
MODEL        = vs.MODEL
AUDIO_DIR    = Path("public/lms")   # relative to project root
TSX_PATH     = Path("src/LMSProblemVideo.tsx")
ROOT_PATH    = Path("src/Root.tsx")
COMP_ID      = "LMSProblemVideo"

# ── Scripts (one string per audio file) ──────────────────────────────────────
ORDER = ["p0", "p1", "p2", "p3", "p4", "p5", "p6", "p7"]

SCRIPTS = {
    "p0": (
        "Most training schools are paying for six different tools "
        "just to run one business."
    ),
    "p1": (
        "An LMS for courses. A website builder for their site. "
        "A CRM for leads. A payment tool for invoices. "
        "An email platform for marketing. A scheduling app for sessions."
    ),
    "p2": (
        "That's five hundred dollars a month — minimum — just to stay open."
    ),
    "p3": (
        "skillbank replaces all of it."
    ),
    "p4": (
        "One platform. Courses, website, marketing, payments, scheduling, "
        "and certificates — all in a single login."
    ),
    "p5": (
        "Your learners get a clean portal built for them. "
        "Your branch managers get their own admin. "
        "Your head office sees everything — all organizations, all branches, "
        "all in one place."
    ),
    "p6": (
        "skillbank. Built for schools that are serious about growth."
    ),
    "p7": (
        "Start your free trial at skillbank dot com."
    ),
}

# ── Helpers ───────────────────────────────────────────────────────────────────

def frames_for_file(path: Path) -> int:
    """Return duration in frames for an mp3, using ffprobe."""
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "json", str(path)],
        capture_output=True, text=True
    )
    data = json.loads(result.stdout)
    seconds = float(data["format"]["duration"])
    return math.ceil(seconds * FPS) + 4   # +4 frames breathing room

def generate_audio(client: OpenAI) -> dict[str, int]:
    """Generate mp3 files; return {key: frames}."""
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    durations = {}
    for key in ORDER:
        out = AUDIO_DIR / f"{key}.mp3"
        if out.exists():
            print(f"  {key}.mp3 already exists — skipping TTS")
        else:
            print(f"  Generating {key}.mp3 …")
            vs.speak(client, SCRIPTS[key], out)
        durations[key] = frames_for_file(out)
        print(f"    → {durations[key]} frames")
    return durations

def patch_tsx(durations: dict[str, int]) -> None:
    """Rewrite DURATIONS constant in LMSProblemVideo.tsx."""
    src = TSX_PATH.read_text()
    lines = [f"  {k}: {v}," for k, v in durations.items()]
    new_block = "const DURATIONS = {\n" + "\n".join(lines) + "\n};"
    src = re.sub(r"const DURATIONS = \{[^}]+\};", new_block, src)
    TSX_PATH.write_text(src)
    print(f"  Patched DURATIONS in {TSX_PATH}")

def patch_root(total_frames: int) -> None:
    """Update durationInFrames for LMSProblemVideo in Root.tsx (scoped — never touches other compositions)."""
    src = ROOT_PATH.read_text()
    # Match only the durationInFrames= that appears after id="LMSProblemVideo"
    pattern = r'(id="LMSProblemVideo"[^>]*?durationInFrames=\{)\d+(\})'
    replacement = rf'\g<1>{total_frames}\g<2>'
    new_src, count = re.subn(pattern, replacement, src, flags=re.DOTALL)
    if count == 0:
        print("  WARNING: LMSProblemVideo entry not found in Root.tsx — add it manually.")
    else:
        ROOT_PATH.write_text(new_src)
        print(f"  Patched Root.tsx durationInFrames → {total_frames}")

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY not set")

    client = OpenAI(api_key=api_key)
    print("Generating LMS Problem voice audio …")
    durations = generate_audio(client)

    # Brand intro bumper = 75 frames (not voiced, already baked in)
    total = 170 + sum(durations.values()) + 30   # 170f premade SkillbnkIntroVideo + 30f CTA hold
    print(f"\nTotal frames (incl. 30f CTA hold): {total}  ({total/FPS:.1f}s)")

    patch_tsx(durations)
    print("\nDone. Run:  npx remotion studio  — and preview LMSProblemVideo.")

if __name__ == "__main__":
    main()
