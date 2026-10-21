"""
generate-voice-smscampaigns.py
Voices SmsCampaignsVideo ("SMS Campaigns") with the house
voice from voice_style.py, then patches DURATIONS + VOICED in src/SmsCampaignsVideo.tsx.

Usage:  bash generate-voice-smscampaigns.sh          (reads OPENAI_API_KEY from .env)
        REDO=1 bash generate-voice-smscampaigns.sh   (re-voice every line)
Existing clips are skipped unless REDO=1.
"""
import os, re, json, math, subprocess
from pathlib import Path
from openai import OpenAI
import voice_style as vs   # THE skillBNK voice (shared by every video)

FPS = 30
AUDIO_DIR = Path("public/smscampaigns")
TSX_PATH = Path("src/SmsCampaignsVideo.tsx")

ORDER = ["q0", "q1", "q2", "q3", "q3b", "q4", "q5"]

# Spoken text: brand written "skillbank" so TTS pronounces it right.
# Claims verified against the skillBNK code. All names are fictional (Brightpath Academy).
SCRIPTS = {
    "q0": "Class moved to 6 PM. You emailed everyone. By six, three people had opened it. Most LMS platforms can only send email, and urgent news waits in the inbox. In skillbank, you text the whole class, by name, in seconds.",
    "q1": "We start in the training provider portal. Open Marketing Tools, SMS Marketing. Every text you've sent is here, with how many were sent, failed, or scheduled. Click Add.",
    "q2": "Pick the sender, your own Twilio number from Integrations. Turn on Include user name, then write the message, using name in curly braces. Keep it under three hundred characters, and add a note.",
    "q3": "Now filter users. Choose Program Approved, then the program and the session. Or upload a CSV. Untick anyone who shouldn't get it, and click Send SMS.",
    "q3b": "Now let's see the action on the learner's phone. Seconds later, Maya gets the text, from your own number, with her name on it. No inbox to dig through.",
    "q4": "Back in the training provider portal. Twenty-three texts sent, none failed. For reminders that repeat, open Cron Jobs and schedule it, like every Wednesday at four.",
    "q5": "Urgent news, read in seconds. That's skillbank.",
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
    print("Done. Refresh Remotion Studio → SmsCampaignsVideo.")


if __name__ == "__main__":
    main()
