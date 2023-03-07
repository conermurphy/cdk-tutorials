import * as cdk from 'aws-cdk-lib';
import { CfnOutput, Duration } from 'aws-cdk-lib';
import { Code, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export class LambdaLayersStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 👇 Create the lambda layer
    const loremIpsumLayer = new LayerVersion(this, 'LoremIpsumLayer', {
      code: Code.fromAsset('./resources/layers/loremIpsum'),
      compatibleRuntimes: [Runtime.NODEJS_16_X],
      description: 'Layer containing lorem ipsum package',
    });

    // 👇 Create the Layer Lambda
    const layerLambda = new NodejsFunction(this, 'LayerLambda', {
      memorySize: 1024,
      timeout: Duration.seconds(5),
      runtime: Runtime.NODEJS_16_X,
      handler: 'handler',
      entry: `./resources/lambdas/layer-lambda.ts`,
      bundling: {
        minify: false,
        externalModules: ['lorem-ipsum'],
      },
      layers: [loremIpsumLayer],
    });

    // 👇 Create the Non Layer Lambda
    const nonLayerLambda = new NodejsFunction(this, 'NonLayerLambda', {
      memorySize: 1024,
      timeout: Duration.seconds(5),
      runtime: Runtime.NODEJS_16_X,
      handler: 'handler',
      entry: `./resources/lambdas/non-layer-lambda.ts`,
    });

    // 👇 Output the name of the lambda functions to call via the CLI
    new CfnOutput(this, 'LayerLambdaFunction', {
      value: layerLambda.functionName,
    });
    new CfnOutput(this, 'NonLayerLambdaFunction', {
      value: nonLayerLambda.functionName,
    });
  }
}
