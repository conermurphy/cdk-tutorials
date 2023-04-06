import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Duration } from 'aws-cdk-lib';
import { Rule, Schedule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';

export class LambdaCronJobTriggerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 👇 Defining our Lambda function
    const helloWorldLambda = new NodejsFunction(this, 'HelloWorld', {
      runtime: Runtime.NODEJS_16_X,
      entry: './resources/lambdas/hello-world.ts',
      handler: 'handler',
      timeout: Duration.seconds(30),
    });

    // 👇 Defining our CloudWatch Event Rule for our CRON job to run every 5 minutes
    const rule = new Rule(this, 'Rule', {
      schedule: Schedule.cron({
        minute: '*/5',
      }),
    });

    // 👇 Defining our Lambda function as the target for our CloudWatch Event Rule
    rule.addTarget(new LambdaFunction(helloWorldLambda));
  }
}
