"""
generate-voice-samples.py — one line, several voices, so you can pick the house voice by ear.
Output: public/voice-samples/<letter>-<name>.mp3  (open the folder in Finder and play them)
"""
import os, json, subprocess
from pathlib import Path
from openai import OpenAI

LINE = ("Now the branch portal. The manager signs in, picks their branch, "
        "and the course is already there, managed by head office.")

FRIENDLY = ("Speak in a warm, friendly, relaxed tone, like you're chatting with a colleague over coffee. "
            "Natural, easy pace. Smile a little. Don't sound salesy, pushy, or like an announcer.")

SAMPLES = [
    ("A-current-sage", "tts-1-hd", "sage", 0.95, None),              # today's house voice (for reference)
    ("B-nova", "tts-1-hd", "nova", 1.0, None),                        # bright, friendly
    ("C-shimmer", "tts-1-hd", "shimmer", 1.0, None),                  # soft, gentle
    ("D-alloy", "tts-1-hd", "alloy", 1.0, None),                      # neutral, calm
    ("E-coral-friendly", "gpt-4o-mini-tts", "coral", 1.08, FRIENDLY), # warm + steerable
    ("F-marin-friendly", "gpt-4o-mini-tts", "marin", 1.08, FRIENDLY), # newest, most natural
]

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
out_dir = Path("public/voice-samples"); out_dir.mkdir(parents=True, exist_ok=True)
words = len(LINE.split())
for name, model, voice, speed, instr in SAMPLES:
    out = out_dir / f"{name}.mp3"
    kw = {"instructions": instr} if instr else {}
    try:
        client.audio.speech.create(model=model, voice=voice, input=LINE, speed=speed, **kw).write_to_file(out)
        d = float(json.loads(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", str(out)],
                                           capture_output=True, text=True).stdout)["format"]["duration"])
        print(f"  ✓ {name:20s} {model:16s} {voice:8s} speed {speed:<5} → {d:4.1f}s  ({words/d:.1f} words/sec)")
    except Exception as e:
        print(f"  ✗ {name}: {str(e)[:120]}")
print(f"\nListen: open \"{out_dir.resolve()}\"")
