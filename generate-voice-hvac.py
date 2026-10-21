"""
generate-voice-hvac.py
Generates OpenAI TTS audio for HVACTrainingVideo, then patches the DURATIONS
block in src/HVACTrainingVideo.tsx and the HVACTrainingVideo entry in Root.tsx
(scoped to that id only — never touches other compositions).

Usage:  bash generate-voice-hvac.sh      (reads OPENAI_API_KEY from .env)
Re-run safe: existing clips are skipped. Delete public/hvac/<key>.mp3 to redo one line,
or run  REDO=1 bash generate-voice-hvac.sh  to re-voice every line.
"""
import os, re, json, math, subprocess
from pathlib import Path
from openai import OpenAI
import voice_style as vs   # THE skillBNK voice (shared by every video)

FPS        = 30
VOICE      = vs.VOICE
MODEL      = vs.MODEL
AUDIO_DIR  = Path("public/hvac")
TSX_PATH   = Path("src/HVACTrainingVideo.tsx")
ROOT_PATH  = Path("src/Root.tsx")
INTRO      = 170   # premade SkillbnkIntroVideo
TAIL       = 30    # hold on the CTA

AUDIENCE = vs.HVAC_AUDIENCE   # tone comes from voice_style.py

ORDER = ["h0", "h1", "h2", "h3", "t1", "h4", "h5", "h6", "c1", "c2", "c3", "c4", "h7", "h8"]

# Spoken text: brand is written "skillbank" so TTS pronounces it correctly.
SCRIPTS = {
    "h0": "Your best HVAC tech just spent another Saturday training the new hire. Again.",
    "h1": "Most HVAC companies still train the old way. Ride-alongs. Paper binders. Safety videos nobody can track.",
    "h2": ("Every new hire pulls a senior tech off the truck. "
           "And when someone asks for training records, you're digging through a filing cabinet."),
    "h3": "skillbank turns your team's know-how into training that runs itself.",
    # ── the 3 kinds of training every small company needs ──
    "t1": ("Every small company needs three kinds of training. Onboarding for new hires. "
           "Ongoing training, like best practices and customer care. "
           "And quick rollouts when you add a new tool or service."),
    "h4": ("Tell the AI course creator what your techs need to know. "
           "It builds the lessons and the quiz in minutes."),
    "h5": ("New techs learn on their phone, between calls. "
           "And you see who finished, who passed, and who needs help."),
    "h6": ("Certificates are issued automatically. Text reminders chase anyone who's overdue. "
           "And every record is ready the moment you need it."),
    # ── operations: one tool for the whole HVAC team ──
    "c1": "Need to reach a tech in the field? Message them directly, in real time, right inside skillbank.",
    "c2": ("Training sessions, ride-alongs, and deadlines all live on one shared calendar. "
           "And your team gets notified automatically."),
    "c3": "Built-in referrals turn your best techs into recruiters. And every referral and reward is tracked for you.",
    "c4": "Training, chat, calendar, referrals. Drop the extra apps, and run your whole HVAC team from one tool.",
    "h7": "Every branch. Every truck. Trained the same way.",
    "h8": "skillbank. Train techs faster, and get them back on the job. Start your free trial at skillbank dot com.",
}


def frames_for_file(path: Path) -> int:
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", str(path)],
                       capture_output=True, text=True)
    return math.ceil(float(json.loads(r.stdout)["format"]["duration"]) * FPS) + 6  # +6f breathing room


def tts(client: OpenAI, text: str, out: Path) -> None:
    vs.speak(client, text, out, AUDIENCE)


def main():
    key = os.environ.get("OPENAI_API_KEY")
    if not key:
        raise RuntimeError("OPENAI_API_KEY not set")
    client = OpenAI(api_key=key)
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)

    print(f"🎙  {MODEL} — voice: {VOICE}\n")
    durations = {}
    for k in ORDER:
        out = AUDIO_DIR / f"{k}.mp3"
        if out.exists() and os.environ.get("REDO") != "1":
            print(f"  {k}.mp3 exists — skipping")
        else:
            print(f"  generating {k}.mp3 …")
            tts(client, SCRIPTS[k], out)
        durations[k] = frames_for_file(out)
        print(f"    → {durations[k]} frames")

    total = INTRO + sum(durations.values()) + TAIL
    print(f"\nTotal: {total} frames ({total / FPS:.1f}s)")

    src = TSX_PATH.read_text()
    block = "const DURATIONS = {\n" + "\n".join(f"  {k}: {v}," for k, v in durations.items()) + "\n};"
    src = re.sub(r"const DURATIONS = \{[^}]+\};", block, src)
    voiced = ", ".join(f'"{k}"' for k in ORDER if (AUDIO_DIR / f"{k}.mp3").exists())
    src = re.sub(r"const VOICED: string\[\] = \[[^\]]*\];", f"const VOICED: string[] = [{voiced}];", src)
    TSX_PATH.write_text(src)
    print(f"  patched DURATIONS in {TSX_PATH}")

    print("\nDone. Run: npx remotion studio")


if __name__ == "__main__":
    main()
