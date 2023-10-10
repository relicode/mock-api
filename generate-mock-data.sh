#!/bin/sh

set -e

DATA_PATH="$(readlink -f "$DATA_PATH" || printf '')"

cd "$(dirname "$(readlink -f "$0")")"

DATA_PATH="$DATA_PATH" npm run --silent generate $@
