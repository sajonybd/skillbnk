#!/usr/bin/env bash
# skillBNK HVAC Training Video — voice generator. Run from the project root:
#   bash generate-voice-hvac.sh
set -euo pipefail
cd "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Load API key from .env if not already set
if [[ -z "${OPENAI_API_KEY:-}" && -f .env ]]; then
  set -a; source .env; set +a
fi
if [[ -z "${OPENAI_API_KEY:-}" ]]; then
  echo "ERROR: OPENAI_API_KEY not set (add it to .env)"; exit 1
fi
if ! python3 -c "import openai" 2>/dev/null; then
  pip3 install openai --quiet
fi
python3 generate-voice-hvac.py
