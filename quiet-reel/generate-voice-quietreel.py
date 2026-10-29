"""Voice + mix the 'Who has gone quiet?' reel with the house voice (marin).
Run from the project root (skillbnk-videos), on the Mac:   python3 quiet-reel/generate-voice-quietreel.py
Needs OPENAI_API_KEY in .env (same as every other generate-voice script). REDO=1 re-voices every line.
Output: out/ReelQuietLearner_voiced.mp4
"""
import os, subprocess, sys, json
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import voice_style  # house voice v4

env = ROOT / ".env"
if not os.environ.get("OPENAI_API_KEY") and env.exists():
    for line in env.read_text().splitlines():
        if line.startswith("OPENAI_API_KEY="):
            os.environ["OPENAI_API_KEY"] = line.split("=", 1)[1].strip().strip('"').strip("'")
KEY = os.environ.get("OPENAI_API_KEY") or sys.exit("OPENAI_API_KEY not set (add it to .env)")

# beat start (s), spoken text. Spoken brand = "skillbank".
LINES = [
    (0.0,  "Monday, nine AM. Priya has thirty-seven names in a spreadsheet."),
    (4.9,  "Who's waiting? Whose trial ends Friday? Who quietly stopped coming?"),
    (9.8,  "Sorting it out eats forty minutes a week. One missed trial can mean a lost learner."),
    (17.1, "Then she opens skillbank. Four lists: Pending, Trial, Approved, Inactive."),
    (22.4, "And the Last Active column shows who has gone quiet."),
    (27.3, "Now she knows who needs a decision, a nudge, or a message."),
    (33.0, "Forty minutes becomes about five. That's roughly twenty-nine hours back every year."),
    (39.1, "Thirty-seven learners or three hundred seventy. Same four lists."),
    (43.6, "See the full walkthrough on YouTube. The link is in the post."),
]
BEAT_DUR = [4.9, 4.9, 7.3, 5.3, 4.9, 5.7, 6.1, 4.5, 5.5]
OUT = ROOT / "public" / "quietreel"; OUT.mkdir(parents=True, exist_ok=True)
for i, (start, text) in enumerate(LINES):
    p = OUT / f"v{i+1}.mp3"
    if p.exists() and not os.environ.get("REDO"):
        continue
    print(f"voicing v{i+1}: {text}")
    voice_style.speak_http(KEY, text, str(p))

def dur(p):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)]).decode())

ins = ["-i", str(Path(__file__).parent / "ReelQuietLearner_music.mp4")]
fl, labels = [], []
for i, (start, text) in enumerate(LINES):
    p = OUT / f"v{i+1}.mp3"; d = dur(p)
    flag = "  <-- LONGER THAN ITS SCENE, shorten the line" if d > BEAT_DUR[i] - 0.5 else ""
    print(f"v{i+1}: {d:.1f}s in a {BEAT_DUR[i]}s scene{flag}")
    ins += ["-i", str(p)]
    ms = int((start + 0.35) * 1000)
    fl.append(f"[{i+1}:a]adelay={ms}|{ms},volume=1.6[v{i}]"); labels.append(f"[v{i}]")
fl.append("[0:a]" + "".join(labels) + f"amix=inputs={len(labels)+1}:normalize=0:dropout_transition=0,alimiter=limit=0.95[out]")
(ROOT / "out").mkdir(exist_ok=True)
dst = ROOT / "out" / "ReelQuietLearner_voiced.mp4"
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *ins, "-filter_complex", ";".join(fl), "-map", "0:v", "-map", "[out]",
                "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", str(dst)], check=True)
print("done ->", dst)
