#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Route53UpdateARecordStack } from '../lib/route-53-update-a-record-stack';

const app = new cdk.App();
new Route53UpdateARecordStack(app, 'Route53UpdateARecordStack', {
  env: {
    region: 'us-east-1',
  },
});
