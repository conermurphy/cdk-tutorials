import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ConfigProps } from './config';

type AwsEnvStackProps = StackProps & {
  config: Readonly<ConfigProps>;
};

export class AwsEnvStack extends Stack {
  constructor(scope: Construct, id: string, props: AwsEnvStackProps) {
    super(scope, id, props);

    const { config } = props;

    new NodejsFunction(this, 'TestLambda', {
      entry: './resources/test-lambda.ts',
      handler: 'handler',
      environment: {
        LAMBDA_ENV: config.LAMBDA_ENV,
      },
    });
  }
}
