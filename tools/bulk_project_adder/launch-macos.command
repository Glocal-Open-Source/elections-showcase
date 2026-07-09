#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

if command -v python3 >/dev/null 2>&1; then
  python3 bulk_project_adder.py
elif command -v python >/dev/null 2>&1; then
  python bulk_project_adder.py
else
  echo "Python 3 was not found. Install Python 3, then run this launcher again."
  read -r -p "Press Enter to close"
  exit 1
fi
