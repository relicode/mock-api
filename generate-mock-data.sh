#!/bin/sh

PRINT_MOCK_DATA=true node --no-warnings --loader ts-node/esm ./src/generate-mock-data.ts
