import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Cors, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { CfnWebACLAssociation, CfnWebACL } from 'aws-cdk-lib/aws-wafv2';

export class RestApiThrottlingWafStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // 1. Create an API
    const api = new RestApi(this, 'REST_API', {
      restApiName: 'REST API',
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
    });

    // 2. Create the Lambda function to handle requests
    const postsLambda = new NodejsFunction(this, 'LAMBDA', {
      entry: 'resources/posts.ts',
      handler: 'handler',
    });

    // 3. Connect the Lambda function to the API
    const postsIntegration = new LambdaIntegration(postsLambda);

    // 4. Define a method on our API
    api.root.addMethod('GET', postsIntegration);

    // 5. Create a WebACL with an IP rate-based rule
    const webAcl = new CfnWebACL(this, 'WEB_ACL', {
      // Allow all requests by default
      defaultAction: {
        allow: {},
      },
      // For API Gateway, the scope must be REGIONAL
      scope: 'REGIONAL',
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        sampledRequestsEnabled: true,
        metricName: 'web-acl-metric',
      },
      rules: [
        // Defining a rate-based rule
        {
          name: 'rate-based-rule',
          // If this rule is matched, block the request and return a 403
          action: {
            block: {},
          },
          priority: 1,
          visibilityConfig: {
            cloudWatchMetricsEnabled: true,
            sampledRequestsEnabled: true,
            metricName: 'rate-based-rule-metric',
          },
          // Define the statement for the rule over a 5 minute period
          statement: {
            rateBasedStatement: {
              limit: 100,
              aggregateKeyType: 'IP',
            },
          },
        },
      ],
    });

    // 6. Associate the WebACL with the API
    const webAclAssociation = new CfnWebACLAssociation(
      this,
      'WEB_ACL_ASSOCIATION',
      {
        resourceArn: api.deploymentStage.stageArn,
        webAclArn: webAcl.attrArn,
      }
    );

    // 7. Add a dependency on the API to the WebACL association so the API is deployed first
    webAclAssociation.node.addDependency(api);
  }
}
