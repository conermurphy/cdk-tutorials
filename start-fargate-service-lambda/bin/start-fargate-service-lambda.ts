#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { StartFargateServiceLambdaStack } from '../lib/start-fargate-service-lambda-stack';

const app = new cdk.App();
new StartFargateServiceLambdaStack(app, 'StartFargateServiceLambdaStack', {});
