#!/usr/bin/env tsx

import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { HibobIntegrationMockApiStack } from '../lib/hibob-integration-mock-api-stack'

const app = new cdk.App()
new HibobIntegrationMockApiStack(app, 'mock')
// new HibobIntegrationMockApiStack(app, 'test', { stageName: 'test' })

app.synth()
