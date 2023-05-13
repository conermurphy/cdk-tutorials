#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsEnvStack } from '../lib/aws-env-stack';
import { getConfig } from '../lib/config';

const config = getConfig();

const app = new cdk.App();

new AwsEnvStack(app, 'AwsEnvStack', {
  env: {
    region: config.REGION,
  },
  config,
});
