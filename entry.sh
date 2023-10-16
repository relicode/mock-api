#!/bin/sh

RIE_EXEC="/usr/local/bin/aws-lambda-rie"
NPX_DIR="/usr/local/bin/npx"

if [ -z "$AWS_LAMBDA_RUNTIME_API" ]; then
  exec "$RIE_EXEC" "$NPX_DIR" aws-lambda-ric $@
else
  exec "$NPX_DIR" aws-lambda-ric $@
fi
