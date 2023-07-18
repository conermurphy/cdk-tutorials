import { Stack, StackProps, Duration, CfnOutput } from 'aws-cdk-lib';
import { Rule, RuleTargetInput, Schedule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export class WarmColdLambdasStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // 1. Defining our Warm and Cold Lambda Functions
    const warmLambda = new NodejsFunction(this, 'WarmLambda', {
      runtime: Runtime.NODEJS_16_X,
      entry: './resources/warm-lambda.ts',
      handler: 'handler',
      timeout: Duration.seconds(30),
    });

    const coldLambda = new NodejsFunction(this, 'ColdLambda', {
      runtime: Runtime.NODEJS_16_X,
      entry: './resources/cold-lambda.ts',
      handler: 'handler',
      timeout: Duration.seconds(30),
    });

    // 2. Defining our CloudWatch Event Rule for our CRON job to run every 5 minutes
    const rule = new Rule(this, 'Rule', {
      schedule: Schedule.cron({
        minute: '*/5',
      }),
    });

    // 3. Defining our warm Lambda function as the target for our CloudWatch Event Rule, also pass through an event for us to use in the function to exit early
    rule.addTarget(
      new LambdaFunction(warmLambda, {
        event: RuleTargetInput.fromObject({
          source: 'aws.events',
        }),
      })
    );

    // Misc. Outputting our function names
    new CfnOutput(this, 'WarmLambdaName', {
      value: warmLambda.functionName,
    });

    new CfnOutput(this, 'ColdLambdaName', {
      value: coldLambda.functionName,
    });
  }
}
