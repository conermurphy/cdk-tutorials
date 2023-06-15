#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { RestApiWithApiKeyAuthStack } from '../lib/rest-api-with-api-key-auth-stack';

const app = new cdk.App();
new RestApiWithApiKeyAuthStack(app, 'RestApiWithApiKeyAuthStack', {});
