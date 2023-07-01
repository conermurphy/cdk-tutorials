#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { GraphqlApiWithApiKeyAuthStack } from '../lib/graphql-api-with-api-key-auth-stack';

const app = new cdk.App();
new GraphqlApiWithApiKeyAuthStack(app, 'GraphqlApiWithApiKeyAuthStack', {});
