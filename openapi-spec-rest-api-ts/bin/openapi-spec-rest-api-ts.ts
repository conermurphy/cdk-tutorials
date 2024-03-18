#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { OpenapiSpecRestApiTsStack } from '../lib/openapi-spec-rest-api-ts-stack';

const app = new cdk.App();
new OpenapiSpecRestApiTsStack(app, 'OpenapiSpecRestApiTsStack', {});
