#!/bin/sh

set -e

BASE_NAME="aws-lambda-rie"
URL="https://github.com/aws/aws-lambda-runtime-interface-emulator/releases/download/v1.14/aws-lambda-rie-arm64"
wget -O "$BASE_NAME" "$URL" && chmod 755 "$BASE_NAME"
