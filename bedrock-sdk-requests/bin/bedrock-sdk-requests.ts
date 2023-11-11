#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { BedrockSdkRequestsStack } from '../lib/bedrock-sdk-requests-stack';

const app = new cdk.App();
new BedrockSdkRequestsStack(app, 'BedrockSdkRequestsStack', {
  env: {
    region: 'us-east-1',
  },
});
