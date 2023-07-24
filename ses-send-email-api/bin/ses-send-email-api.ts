#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SesSendEmailApiStack } from '../lib/ses-send-email-api-stack';

const app = new cdk.App();
new SesSendEmailApiStack(app, 'SesSendEmailApiStack', {});
