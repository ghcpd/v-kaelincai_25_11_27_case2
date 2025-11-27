#!/bin/bash

# Wrapper script to run UI tests
# This calls the main test suite runner

set -e

cd "$(dirname "$0")/.."

# Run the main UI test suite
bash scripts/run_ui_suite.sh
