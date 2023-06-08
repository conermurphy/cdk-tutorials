#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CloudwatchAlarmsSesNotificationsStack } from '../lib/cloudwatch-alarms-ses-notifications-stack';

const app = new cdk.App();
new CloudwatchAlarmsSesNotificationsStack(
  app,
  'CloudwatchAlarmsSesNotificationsStack',
  {}
);
