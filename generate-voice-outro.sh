#!/usr/bin/env bash
# Voice the MAIN OUTRO (used by every video). Run from the project root:
#   bash generate-voice-outro.sh
set -euo pipefail
cd "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -z "${OPENAI_API_KEY:-}" && -f .env ]]; then
  set -a; source .env; set +a
fi
if [[ -z "${OPENAI_API_KEY:-}" ]]; then
  echo "ERROR: OPENAI_API_KEY not set (add it to .env)"; exit 1
fi
if ! python3 -c "import openai" 2>/dev/null; then
  pip3 install openai --quiet
fi
python3 generate-voice-outro.py
