#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { TriggeringLambdasEventbusStack } from '../lib/triggering-lambdas-eventbus-stack';

const app = new cdk.App();
new TriggeringLambdasEventbusStack(app, 'TriggeringLambdasEventbusStack', {});
