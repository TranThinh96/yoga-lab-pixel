#!/bin/bash
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo "Cần cài Node.js 18+ tại https://nodejs.org rồi mở lại file này."
  read -p "Nhấn Enter để đóng..."; exit 1
fi
node server.js
