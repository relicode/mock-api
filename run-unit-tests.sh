#!/bin/sh

TEST_FILES="$(find src -type f -iname "*.spec.ts")"

npm run node-ts $TEST_FILES
