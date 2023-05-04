#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Route53DnsTriggerLambdaStack } from '../lib/route-53-dns-trigger-lambda-stack';

const app = new cdk.App();

new Route53DnsTriggerLambdaStack(app, 'Route53DnsTriggerLambdaStack', {
  env: {
    region: 'us-east-1',
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
});
