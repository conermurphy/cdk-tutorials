import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  Cors,
  LambdaIntegration,
  RestApi,
  ApiKeySourceType,
  ApiKey,
  UsagePlan,
} from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export class RestApiApiKeyThrottlingStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // 1. Create our API Gateway
    const api = new RestApi(this, 'REST_API', {
      restApiName: 'REST API',
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
      apiKeySourceType: ApiKeySourceType.HEADER,
    });

    // 2. Create our API Key
    const apiKey = new ApiKey(this, 'API_KEY');

    // 3. Create a usage plan and add the API key to it
    const usagePlan = new UsagePlan(this, 'USAGE_PLAN', {
      name: 'Usage Plan',
      apiStages: [
        {
          api,
          stage: api.deploymentStage,
        },
      ],
      // NOTE: Throttling is purposefully set low to allow for easier testing of the rate limit
      throttle: {
        rateLimit: 1,
        burstLimit: 1,
      },
    });

    usagePlan.addApiKey(apiKey);

    // 4. Create our Lambda functions to handle requests
    const postsLambda = new NodejsFunction(this, 'LAMBDA', {
      entry: 'resources/posts.ts',
      handler: 'handler',
    });

    // 5. Connect our Lambda functions to our API Gateway endpoints
    const postsIntegration = new LambdaIntegration(postsLambda);

    // 6. Define our API Gateway methods
    api.root.addMethod('GET', postsIntegration, {
      apiKeyRequired: true,
    });

    // Misc: Outputs
    new CfnOutput(this, 'API Key ID', {
      value: apiKey.keyId,
    });
  }
}
