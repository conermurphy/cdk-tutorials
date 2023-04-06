#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { LambdaCronJobTriggerStack } from '../lib/lambda-cron-job-trigger-stack';

const app = new cdk.App();
new LambdaCronJobTriggerStack(app, 'LambdaCronJobTriggerStack', {});
