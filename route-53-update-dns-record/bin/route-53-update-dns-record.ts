#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Route53UpdateDNSRecordStack } from '../lib/route-53-update-dns-record-stack';

const app = new cdk.App();
new Route53UpdateDNSRecordStack(app, 'Route53UpdateDNSRecordStack', {
  env: {
    region: 'us-east-1',
  },
});
