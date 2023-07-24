import * as cdk from 'aws-cdk-lib';
import {
  UsagePlan,
  RestApi,
  ApiKey,
  Cors,
  ApiKeySourceType,
  LambdaIntegration,
} from 'aws-cdk-lib/aws-apigateway';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { EmailIdentity, Identity } from 'aws-cdk-lib/aws-ses';
import { Construct } from 'constructs';

export class SesSendEmailApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. Define our SES Verified Email Address
    const verifiedEmail = 'YOUR_EMAIL_ADDRESS';
    const identity = Identity.email(verifiedEmail);
    new EmailIdentity(this, 'SESIdentity', {
      identity,
    });

    // 2. Create our Lambda functions to handle requests
    const sendEmailLambda = new NodejsFunction(this, 'SendEmailLambda', {
      entry: 'resources/send-email.ts',
      handler: 'handler',
      environment: {
        VERIFIED_EMAIL: verifiedEmail,
      },
      initialPolicy: [
        new PolicyStatement({
          actions: ['ses:SendEmail'],
          resources: [
            `arn:aws:ses:${this.region}:${this.account}:identity/${identity.value}`,
          ],
        }),
      ],
    });

    // 3. Define our REST API
    const api = new RestApi(this, 'EmailApi', {
      restApiName: 'EmailApi',
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
      apiKeySourceType: ApiKeySourceType.HEADER,
    });

    // 4. Create our API Key
    const apiKey = new ApiKey(this, 'EmailApiKey');

    // 5. Create a usage plan and add the API key to it
    const usagePlan = new UsagePlan(this, 'EmailUsagePlan', {
      name: 'Email Usage Plan',
      apiStages: [
        {
          api,
          stage: api.deploymentStage,
        },
      ],
    });

    usagePlan.addApiKey(apiKey);

    // 6. Connect our Lambda functions to our API Gateway endpoints
    const sendEmailIntegration = new LambdaIntegration(sendEmailLambda);

    // 7. Define a POST handler on the root of our API
    api.root.addMethod('POST', sendEmailIntegration, {
      apiKeyRequired: true,
    });

    // Misc: Outputs
    new cdk.CfnOutput(this, 'API Key ID', {
      value: apiKey.keyId,
    });
  }
}
