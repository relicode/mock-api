#!/usr/bin/env -S npx tsx

import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { HibobIntegrationMockApiStack } from '../lib/hibob-integration-mock-api-stack.js'

const app = new cdk.App()
new HibobIntegrationMockApiStack(app, 'mock')

app.synth()
