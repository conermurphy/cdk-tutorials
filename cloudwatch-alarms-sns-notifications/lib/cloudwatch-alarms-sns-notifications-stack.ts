import * as cdk from 'aws-cdk-lib';
import {
  Alarm,
  ComparisonOperator,
  TreatMissingData,
} from 'aws-cdk-lib/aws-cloudwatch';
import { SnsAction } from 'aws-cdk-lib/aws-cloudwatch-actions';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { FilterPattern, MetricFilter } from 'aws-cdk-lib/aws-logs';
import { Subscription, SubscriptionProtocol, Topic } from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';

export class CloudwatchAlarmsSnsNotificationsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The email address to send the SNS notifications to
    const emailAddress = '';

    // 1. Define a SNS topic and subscribe to it with our email address
    const emailSnsTopic = new Topic(this, 'emailSnsTopic');

    new Subscription(this, 'emailSubscription', {
      topic: emailSnsTopic,
      protocol: SubscriptionProtocol.EMAIL,
      endpoint: emailAddress,
    });

    // 2. Define a lambda function for our CloudWatch alarm to monitor the logs of
    const exampleLambda = new NodejsFunction(this, 'ExampleLambda', {
      handler: 'handler',
      runtime: Runtime.NODEJS_16_X,
      entry: './resources/example.ts',
    });

    // 3. Define our custom metric for monitoring our logs for certain errors and/or phrases
    const customMetric = new MetricFilter(this, 'CustomMetric', {
      logGroup: exampleLambda.logGroup,
      metricNamespace: 'CustomErrors',
      metricName: 'CustomErrorMetric',
      // We can update this array to include any other phrases we want to monitor and triggering the alarm for
      filterPattern: FilterPattern.anyTerm(...['ERROR:']),
      // If the log contains the target phrases then the metric value will be 1
      metricValue: '1',
    });

    // 4. Define our CloudWatch alarm to monitor our custom metric
    const customAlarm = new Alarm(this, `CustomAlarm`, {
      metric: customMetric.metric(),
      evaluationPeriods: 1,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
      // Trigger the alarm when the metric value is greater than 0
      threshold: 0,
      treatMissingData: TreatMissingData.NOT_BREACHING,
      alarmName: 'CustomAlarm',
    });

    // 5. Add an alarm action to trigger our SNS topic when the alarm is triggered
    customAlarm.addAlarmAction(new SnsAction(emailSnsTopic));

    // Misc. Outputs
    new cdk.CfnOutput(this, 'LambdaName', {
      value: exampleLambda.functionName,
    });
  }
}
