#!/usr/bin/env bash
# Storyteller voice for the premium Reel (Bulk Enrollment). Run from the project root:
#   bash generate-voice-reelstory.sh        (REDO=1 to re-voice every beat)
set -euo pipefail
cd "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -z "${OPENAI_API_KEY:-}" && -f .env ]]; then set -a; source .env; set +a; fi
if [[ -z "${OPENAI_API_KEY:-}" ]]; then echo "ERROR: OPENAI_API_KEY not set (add it to .env)"; exit 1; fi
python3 -c "import openai" 2>/dev/null || pip3 install openai --quiet
python3 generate-voice-reelstory.py
