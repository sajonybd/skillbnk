#!/bin/bash
# skillBNK Voice Generator — wrapper for generate-voice-orgs.py (Organizations video)
set -e
cd "$(dirname "$0")"

# Load API key from .env if not already set
if [[ -z "${OPENAI_API_KEY:-}" && -f .env ]]; then
  set -a; source .env; set +a
fi

if [[ -z "$OPENAI_API_KEY" ]]; then
  echo "❌  Set OPENAI_API_KEY:  OPENAI_API_KEY=sk-... bash generate-voice-orgs.sh"
  exit 1
fi

python3 generate-voice-orgs.py "$OPENAI_API_KEY" "${OPENAI_VOICE:-sage}"
