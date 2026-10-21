#!/usr/bin/env bash
# generate-voice-lms.sh
# Run from the root of your Remotion project:
#   OPENAI_API_KEY=sk-... bash generate-voice-lms.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Load API key from .env if not already set
if [[ -z "${OPENAI_API_KEY:-}" && -f .env ]]; then
  set -a; source .env; set +a
fi

echo "=== skillBNK LMS Problem Video — Voice Generator ==="
echo ""

if [[ -z "${OPENAI_API_KEY:-}" ]]; then
  echo "ERROR: OPENAI_API_KEY is not set."
  echo "Usage: OPENAI_API_KEY=sk-... bash generate-voice-lms.sh"
  exit 1
fi

# Ensure Python deps
if ! python3 -c "import openai" 2>/dev/null; then
  echo "Installing openai python package …"
  pip3 install openai --quiet
fi

python3 generate-voice-lms.py

echo ""
echo "=== Next steps ==="
echo "1. npx remotion studio                          # preview LMSProblemVideo"
echo "2. npx remotion render LMSProblemVideo out/lms-problem.mp4"
echo "3. Upload out/lms-problem.mp4 to YouTube"
