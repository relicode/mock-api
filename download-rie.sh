#!/bin/sh

BASE_NAME="aws-lambda-rie"
URL="https://github.com/aws/aws-lambda-runtime-interface-emulator/releases/download/v1.14/aws-lambda-rie"

(node -e 'process.exit(/arm/i.test(process.arch) ? 0 : 1)') && URL="$URL-arm64"

[ ! -x "$BASE_NAME" ] && wget -O "$BASE_NAME" "$URL" && chmod 755 "$BASE_NAME"

exit 0
