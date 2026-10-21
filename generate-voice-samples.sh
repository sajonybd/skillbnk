#!/usr/bin/env bash
# Make 6 voice samples of the same line so you can pick the house voice by ear.
set -euo pipefail
cd "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -z "${OPENAI_API_KEY:-}" && -f .env ]]; then set -a; source .env; set +a; fi
python3 generate-voice-samples.py
open public/voice-samples 2>/dev/null || true
