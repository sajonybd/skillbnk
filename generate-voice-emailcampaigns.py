"""
generate-voice-emailcampaigns.py
Voices EmailCampaignsVideo ("Email Campaigns") with the house
voice from voice_style.py, then patches DURATIONS + VOICED in src/EmailCampaignsVideo.tsx.

Usage:  bash generate-voice-emailcampaigns.sh          (reads OPENAI_API_KEY from .env)
        REDO=1 bash generate-voice-emailcampaigns.sh   (re-voice every line)
Existing clips are skipped unless REDO=1.
"""
import os, re, json, math, subprocess
from pathlib import Path
from openai import OpenAI
import voice_style as vs   # THE skillBNK voice (shared by every video)

FPS = 30
AUDIO_DIR = Path("public/emailcampaigns")
TSX_PATH = Path("src/EmailCampaignsVideo.tsx")

ORDER = ["s0", "s1", "s2", "s3", "s4", "s4b", "s5", "s6"]

# Spoken text: brand written "skillbank" so TTS pronounces it right.
# Claims verified against the skillBNK code. All names are fictional (Brightpath Academy).
SCRIPTS = {
    "s0": "Forty-eight email addresses, pasted by hand. Six bounce, and nobody knows who got it. Most LMS platforms send you somewhere else to email learners. In skillbank, pick a program, and every learner gets it, by name.",
    "s1": "We start in the training provider portal. Your location's email lives under Marketing Tools, Email Marketing. Every campaign shows its subject, how many users, how many were sent, how many failed, and whether it's scheduled. Click Add.",
    "s2": "Step one is the audience. Choose the user type, like Approved, then the program and the session. Your list fills in instantly. Untick anyone who shouldn't get it, then click Next.",
    "s3": "Step two, the email. Use a SendGrid template, or write a custom email. Pick the sender, add a subject, and write the body once. Use name in curly braces, turn on Include user name, and every learner sees their own name. Add a note, and send.",
    "s4": "It's sent. Twenty-four delivered, zero failed. Open Delivery Reports to see exactly who received it, and when, and export the list to CSV.",
    "s4b": "Now let's see the action on the learner side. Maya opens her inbox, and there it is, from your own sender, with her own name. Not a mass blast. A message meant for her.",
    "s5": "Back in the training provider portal. Need it every week? Open Cron Jobs, set the schedule, like every Monday at nine, and save. The campaign now runs on its own.",
    "s6": "Every learner, by name, on time. That's skillbank.",
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
    print("Done. Refresh Remotion Studio → EmailCampaignsVideo.")


if __name__ == "__main__":
    main()
