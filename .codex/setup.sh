#!/usr/bin/env bash
# Codex local/worktree setup — portfolio Workers SPA default
set -euo pipefail
if [[ -f package-lock.json ]]; then
  npm ci
elif [[ -f package.json ]]; then
  npm install
fi
if [[ -f wrangler.json || -f wrangler.toml || -f wrangler.jsonc ]]; then
  echo "wrangler present — deploy only via portfolio deploy controller / npm run deploy after PR merge"
fi
