"""
generate-voice-followup.py
Voices TrainingFollowUpVideo ("Stop Chasing Employees to Complete Training") with the house
voice from voice_style.py, then patches DURATIONS + VOICED in src/TrainingFollowUpVideo.tsx.

Usage:  bash generate-voice-followup.sh          (reads OPENAI_API_KEY from .env)
        REDO=1 bash generate-voice-followup.sh   (re-voice every line)
Existing clips are skipped unless REDO=1.
"""
import os, re, json, math, subprocess
from pathlib import Path
from openai import OpenAI
import voice_style as vs   # THE skillBNK voice (shared by every video)

FPS = 30
AUDIO_DIR = Path("public/followup")
TSX_PATH = Path("src/TrainingFollowUpVideo.tsx")

ORDER = ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"]

# Spoken text: brand written "skillbank" so TTS pronounces it right.
# Claims verified against the skillBNK code (project doc: skillbnk-code-facts.md).
# All names are fictional (Harbor Point Insurance, Nina Shah, Alex Turner).
SCRIPTS = {
    "t0": "Your team has training to finish. So who's done, who's behind, and who needs a nudge? Usually, that means chasing people one by one.",
    "t1": "With skillbank, open the leaderboard for any program and see every learner's completion at a glance.",
    "t2": "Scroll down, and you can see exactly who's falling behind.",
    "t3": ("Now send them a reminder. Pick the program and session, keep only the people who still need to finish, "
           "and write your message."),
    "t4": "Hit send, and check the delivery report. You can even repeat it every week with a scheduled job.",
    "t5": "A week later, the numbers look very different.",
    "t6": ("When someone finishes, generate their certificate. Check their progress, pick a template, "
           "and upload it in a few clicks."),
    "t7": "See who's behind, nudge them in minutes, and certify who's done. That's skillbank.",
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
    print("Done. Refresh Remotion Studio → TrainingFollowUpVideo.")


if __name__ == "__main__":
    main()
