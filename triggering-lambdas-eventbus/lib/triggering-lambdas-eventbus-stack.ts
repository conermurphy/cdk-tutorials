import * as cdk from 'aws-cdk-lib';
import { EventBus, Rule } from 'aws-cdk-lib/aws-events';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { Duration } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';

export class TriggeringLambdasEventbusStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 👇 Defining our Event Bus
    const eventBus = new EventBus(this, 'eventBus', {
      eventBusName: 'event-bus',
    });

    // 👇 Defining our number generator Lambda function
    const numberGeneratorHandler = new NodejsFunction(
      this,
      'NumberGeneratorHandler',
      {
        runtime: Runtime.NODEJS_16_X,
        entry: './resources/number-generator.ts',
        handler: 'handler',
        timeout: Duration.seconds(30),
        environment: {
          EVENT_BUS_ARN: eventBus.eventBusArn,
        },
      }
    );

    // 👇 Granting the number generator lambda put events
    eventBus.grantPutEventsTo(numberGeneratorHandler);

    // 👇 Defining our odd number processor Lambda function
    const oddNumberProcessorHandler = new NodejsFunction(
      this,
      'OddNumberProcessorHandler',
      {
        runtime: Runtime.NODEJS_16_X,
        entry: './resources/odd-processor.ts',
        handler: 'handler',
        timeout: Duration.seconds(30),
      }
    );

    // 👇 Defining our even number processor Lambda function
    const evenNumberProcessorHandler = new NodejsFunction(
      this,
      'EvenNumberProcessorHandler',
      {
        runtime: Runtime.NODEJS_16_X,
        entry: './resources/even-processor.ts',
        handler: 'handler',
        timeout: Duration.seconds(30),
      }
    );

    // RULES

    // 👇 Define a rule for the event bus to trigger the odd number processor lambda
    new Rule(this, 'OddNumberEventRule', {
      eventBus,
      eventPattern: {
        source: ['example-source'],
        detailType: ['odd'],
      },
    }).addTarget(new LambdaFunction(oddNumberProcessorHandler));

    // 👇 Define a rule for the event bus to trigger the even number processor lambda
    new Rule(this, 'EvenNumberEventRule', {
      eventBus,
      eventPattern: {
        source: ['example-source'],
        detailType: ['even'],
      },
    }).addTarget(new LambdaFunction(evenNumberProcessorHandler));
  }
}
