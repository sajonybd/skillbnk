#!/usr/bin/env python3
"""
skillBNK Voice Generator — Organizations / Onboarding video
OpenAI gpt-4o-mini-tts. Usage: python3 generate-voice-orgs.py <api_key> [voice]
"""
import json, math, os, re, shutil, struct, subprocess, sys
from urllib.request import Request, urlopen
from urllib.error import HTTPError
import voice_style as vs   # THE skillBNK voice (shared by every video)

API_KEY = sys.argv[1] if len(sys.argv) > 1 else os.environ.get("OPENAI_API_KEY", "")
VOICE   = vs.VOICE
MODEL   = vs.MODEL

if not API_KEY:
    print("❌  Pass API key as first argument")
    sys.exit(1)

# Tone/instructions live in voice_style.py

# ── 6 natural marketing scripts — o0 through o5 ──────────────────────────────
SCRIPTS = {
    "ohook": (
        "Other LMS platforms make onboarding a maze. "
        "skillbank gets you live in minutes, not weeks."
    ),

    "o0": "skillbank — powering training providers.",

    "o1": (
        "Running more than one organization? "
        "Switch between all of them from a single portal."
    ),

    "o2": (
        "Setting up a new branch takes minutes. "
        "Add your branch info, two contacts, a short bio, and your documents — "
        "one guided step at a time."
    ),

    "o3": (
        "Add as many branches as you need, each with its own team and setup."
    ),

    "o4": (
        "Add instructors in seconds, and assign them to sessions right away."
    ),

    "o5": (
        "Create your first session in seconds — "
        "just a name and a start date."
    ),

    "o6": (
        "Add categories to keep your programs and courses organized — "
        "this step is optional."
    ),

    "o7": (
        "Define roles and permissions for your staff, "
        "so everyone has exactly the access they need."
    ),

    "o8": (
        "Invite staff members and assign them a role — "
        "they'll get access right away."
    ),

    "o9": (
        "Customize your branch portal's navigation menu, "
        "or start from a ready-made template."
    ),

    "o10": (
        "Connect the tools you already use — "
        "Zoom, SendGrid, Twilio, and more — all from one place."
    ),

    "o11": "One account. Every organization you manage. That's skillbank.",
}

ORDER = ["ohook", "o0", "o1", "o2", "o3", "o4", "o5", "o6", "o7", "o8", "o9", "o10", "o11"]

# Small breathing-room gap (in frames @30fps) inserted between consecutive
# voice lines so one line's audio never gets cut short by the next scene
# starting, and so lines don't feel like they're piling into each other.
GAP_FRAMES = 6

os.makedirs("public", exist_ok=True)

HAVE_FFPROBE = shutil.which("ffprobe") is not None


def call_tts(text, output_path):
    vs.speak_http(API_KEY, text, output_path)


def _mp3_duration_estimate(path):
    """Rough fallback duration estimate by reading one MP3 frame header and
    assuming constant bitrate. Inaccurate for VBR files (can be off by 2x+),
    so this is ONLY used when ffprobe is unavailable."""
    size = os.path.getsize(path)
    with open(path, "rb") as f:
        data = f.read(10)
    offset = 0
    if data[:3] == b"ID3":
        offset = (
            ((data[6] & 0x7F) << 21)
            | ((data[7] & 0x7F) << 14)
            | ((data[8] & 0x7F) << 7)
            | (data[9] & 0x7F)
        )
        offset += 10
    br_table = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0]
    with open(path, "rb") as f:
        f.seek(offset)
        raw = f.read(4)
    if len(raw) < 4:
        return size / 16000
    h = struct.unpack(">I", raw)[0]
    if (h >> 21) != 0x7FF:
        return size / 16000
    bitrate = br_table[(h >> 12) & 0xF] * 1000
    return (size / (bitrate / 8)) if bitrate else size / 16000


def mp3_duration(path):
    """Accurate duration via ffprobe (handles VBR correctly). Falls back to
    the frame-header estimate only if ffprobe isn't installed."""
    if HAVE_FFPROBE:
        try:
            r = subprocess.run(
                ["ffprobe", "-v", "quiet", "-show_entries", "format=duration",
                 "-of", "csv=p=0", path],
                capture_output=True, text=True, check=True,
            )
            return float(r.stdout.strip())
        except Exception as e:
            print(f"  ⚠️  ffprobe failed on {path} ({e}); using rough estimate")
    return _mp3_duration_estimate(path)


if not HAVE_FFPROBE:
    print("⚠️  ffprobe not found — duration estimates may be inaccurate and "
          "can cause voice to be cut off. Install with: brew install ffmpeg\n")

# ── Generate clips ────────────────────────────────────────────────────────────
print(f"🎙  OpenAI {MODEL} — voice: {VOICE}\n")

for key in ORDER:
    text = SCRIPTS[key]
    path = f"public/{key}.mp3"
    print(f"  [{key}] generating...")
    call_tts(text, path)
    dur = mp3_duration(path)
    print(f"  ✓ {path}  ({dur:.2f}s)")

print("\n✅  All clips done — syncing video timing...")

# ── Measure and rebuild timing ────────────────────────────────────────────────
durs_s = [mp3_duration(f"public/{k}.mp3") for k in ORDER]
durs_f = [math.ceil(d * 30) for d in durs_s]

for key, ds, df in zip(ORDER, durs_s, durs_f):
    print(f"  {key}.mp3: {ds:.2f}s = {df}f")

# Starts include a small gap between clips so lines get breathing room and
# are never truncated by the next Sequence beginning right on top of them.
# Clip order is: ohook (index 0, punchy on-screen hook), o0 (index 1, the
# premium SkillbnkIntroScene — logo wipe + shine sweep + tagline + rule-draw),
# then the rest of the onboarding walkthrough. The intro scene needs a fixed
# minimum runtime on screen regardless of how short its own voice-over clip
# (o0) is, otherwise its choreography gets cut short. Force the clip right
# after it to start no earlier than MIN_INTRO_DUR frames after the intro's
# OWN start, inserting a silent hold after o0's audio ends if needed.
INTRO_CLIP_INDEX = 1
MIN_INTRO_DUR = 110

starts, pos = [], 0
for i, d in enumerate(durs_f):
    starts.append(pos)
    pos += d + GAP_FRAMES
    if i == INTRO_CLIP_INDEX:
        pos = max(pos, starts[i] + MIN_INTRO_DUR)
pos -= GAP_FRAMES  # no trailing gap after the very last clip
total = pos + 30

# ── Rebuild VOICE_CLIPS ───────────────────────────────────────────────────────
vc = "const VOICE_CLIPS = [\n"
for i, (key, d) in enumerate(zip(ORDER, durs_f)):
    vc += f'  {{ file: "{key}.mp3", from: {starts[i]:<6}, dur: {d:<4} }},\n'
vc += "];"

# ── Rebuild scene Sequences ───────────────────────────────────────────────────
# Each scene's Sequence spans from its own clip's start up to the NEXT clip's
# start (or, for the last scene, to the very end). This guarantees the scene
# is on screen for the clip's entire audio (no early cut) and holds through
# the gap with no dead/blank frames before the next scene appears.
scene_names = [
    "HookScene", "SkillbnkIntroScene", "SceneOrgSwitcher", "SceneAddBranch",
    "SceneMultiBranch", "SceneAddInstructor", "SceneCreateSession",
    "SceneAddCategory", "SceneCreateRole", "SceneAddStaff",
    "SceneConfigureMenu", "SceneIntegration", "SceneOrgCTA",
]
n = len(ORDER)
lines = ["      {/* 🎬 Scenes */}"]
for i, name in enumerate(scene_names[:n]):
    if i < n - 1:
        dur = starts[i + 1] - starts[i]
    else:
        dur = total - starts[i]
    lines.append(
        f'      <Sequence from={{{starts[i]}}} durationInFrames={{{dur}}}>'
        f' <{name} frame={{frame - {starts[i]}}} fps={{fps}} /></Sequence>'
    )
seqs = "\n".join(lines)

# ── Patch MenuBuilderVideo.tsx ────────────────────────────────────────────────
tsx_path = "src/OrgOnboardingVideo.tsx"
with open(tsx_path) as f:
    src = f.read()
src = re.sub(r'const VOICE_CLIPS = \[[\s\S]*?\];', vc, src)
# Replace everything between <VoiceTrack /> and the closing </AbsoluteFill>
# (anchor-independent of scene comment text, so it can never go stale)
new_section = f'<VoiceTrack />\n{seqs}\n    </AbsoluteFill>'
# Scene timing is computed at runtime in the .tsx (buildTimeline + MAIN INTRO),
# so only VOICE_CLIPS is rewritten here.
with open(tsx_path, "w") as f:
    f.write(src)

# ── Patch Root.tsx ────────────────────────────────────────────────────────────
# Root.tsx reads TOTAL_FRAMES from the video file — no patch needed.

print("\n✅  Clips + VOICE_CLIPS updated (total length is computed in the video file).")
print("▶  Run: npm start")
