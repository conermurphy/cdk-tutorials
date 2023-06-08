#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CloudwatchAlarmsSnsNotificationsStack } from '../lib/cloudwatch-alarms-sns-notifications-stack';

const app = new cdk.App();
new CloudwatchAlarmsSnsNotificationsStack(
  app,
  'CloudwatchAlarmsSnsNotificationsStack',
  {}
);
