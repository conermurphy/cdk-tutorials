#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MigrateLambdaToEcsStack } from '../lib/migrate-lambda-to-ecs-stack';

const app = new cdk.App();
new MigrateLambdaToEcsStack(app, 'MigrateLambdaToEcsStack', {});
