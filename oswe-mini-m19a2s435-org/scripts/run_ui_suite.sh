#!/usr/bin/env bash
# wrapper for project run_ui via frontend
cd "$(dirname "$0")/.."
cd frontend
./scripts/run_ui_suite.sh
