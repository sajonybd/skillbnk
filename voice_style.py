"""
voice_style.py — THE skillBNK voice. Every generate-voice-*.py imports this,
so all videos (and the main intro/outro) sound like the same person.

v4 (current, user's pick "F" from the voice samples, 2026-09-30):
  gpt-4o-mini-tts · voice "marin" · speed 1.08 · short friendly-tone instruction.
  Goal: normal, friendly, relaxed — not forced, not salesy, not an announcer.
History: v1/v2 gpt-4o-mini-tts sage + long instructions (too slow/acted);
v3 tts-1-hd sage 0.95 (LMS voice — natural pace but sounded a bit pushed).
Backups: _backup_before_main_intro/voice_style_v1.py, _v2.py, _v3_lms.py
"""

MODEL = "gpt-4o-mini-tts"
VOICE = "marin"
SPEED = 1.08
FALLBACK_MODEL = "tts-1-hd"   # only if MODEL errors
FALLBACK_VOICE = "sage"       # marin isn't available on tts-1-hd; closest calm female voice

# Kept SHORT on purpose: long tone instructions made earlier voices slow and over-acted.
FRIENDLY = ("Speak in a warm, friendly, relaxed tone, like you're chatting with a colleague over coffee. "
            "Natural, easy pace. Smile a little. Don't sound salesy, pushy, or like an announcer.")

# Kept for scripts that pass an audience; the tone stays the same for every niche.
DEFAULT_AUDIENCE = "the owner of a training business"
HVAC_AUDIENCE = "the owner of a home-services company, like an HVAC contractor"


def instructions(audience: str = DEFAULT_AUDIENCE) -> str:
    return FRIENDLY


def speak(client, text: str, out_path, audience: str = DEFAULT_AUDIENCE) -> None:
    """Generate one clip with the house voice (openai python SDK client)."""
    try:
        kw = {"instructions": instructions(audience)} if MODEL.startswith("gpt-") else {}
        speech = client.audio.speech.create(model=MODEL, voice=VOICE, input=text, speed=SPEED, **kw)
    except Exception as e:
        print(f"    ⚠️  {MODEL}/{VOICE} failed ({str(e)[:100]}) — falling back to {FALLBACK_MODEL}/{FALLBACK_VOICE}")
        speech = client.audio.speech.create(model=FALLBACK_MODEL, voice=FALLBACK_VOICE, input=text, speed=SPEED)
    if hasattr(speech, "write_to_file"):
        speech.write_to_file(out_path)
    else:
        speech.stream_to_file(out_path)


def speak_http(api_key: str, text: str, out_path, audience: str = DEFAULT_AUDIENCE) -> None:
    """Same as speak(), for scripts that call the REST API with urllib (no SDK)."""
    import json
    from urllib.request import Request, urlopen
    from urllib.error import HTTPError

    def _call(payload):
        req = Request("https://api.openai.com/v1/audio/speech", data=json.dumps(payload).encode(),
                      headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"})
        with urlopen(req) as resp, open(out_path, "wb") as f:
            f.write(resp.read())

    try:
        payload = {"model": MODEL, "voice": VOICE, "input": text, "speed": SPEED}
        if MODEL.startswith("gpt-"):
            payload["instructions"] = instructions(audience)
        _call(payload)
    except HTTPError as e:
        print(f"    ⚠️  HTTP {e.code} — falling back to {FALLBACK_MODEL}/{FALLBACK_VOICE}")
        _call({"model": FALLBACK_MODEL, "voice": FALLBACK_VOICE, "input": text, "speed": SPEED})
