#!/bin/sh

cd "$(dirname "$(readlink -f "$0")")"

npx cdk $@
