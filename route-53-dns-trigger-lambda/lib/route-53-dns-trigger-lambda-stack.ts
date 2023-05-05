import { CfnOutput, Fn, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { FilterPattern, LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { LambdaDestination } from 'aws-cdk-lib/aws-logs-destinations';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';

export class Route53DnsTriggerLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Domain we plan on monitoring the logs for and want to trigger the lambda function for
    const domain = '';

    // Defining the log group that will record the requests to the domain
    const logGroup = new LogGroup(this, 'LogGroup', {
      logGroupName: `/aws/route53/${domain}`,
      retention: RetentionDays.THREE_DAYS,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Grant permissions to Route53 to write to the log group
    logGroup.grantWrite(new ServicePrincipal('route53.amazonaws.com'));

    // Define the Route53 hosted zone for our domain
    const domainHostedZone = new HostedZone(this, 'DomainHostedZone', {
      zoneName: domain,
      queryLogsLogGroupArn: logGroup.logGroupArn,
    });

    // Define the lambda function that will be triggered by the requests to the hosted zone
    const testLambda = new NodejsFunction(this, 'TestLambda', {
      runtime: Runtime.NODEJS_16_X,
      handler: 'handler',
      entry: `./resources/test-lambda.ts`,
    });

    // Add a subscription filter to check the logs for the domain and trigger the lambda function if a request is made to it
    logGroup.addSubscriptionFilter('SubscriptionFilter', {
      destination: new LambdaDestination(testLambda),
      filterPattern: FilterPattern.anyTerm(domain),
    });

    // Output the hosted zone name servers so we can update the domain registrar with them
    const nameServers = domainHostedZone.hostedZoneNameServers || [];
    // We use the Fn.join and Fn.select to avoid the error "throw new Error('Found an encoded list token string in a scalar string context. Use \'Fn.select(0, list)\' (not \'list[0]\') to extract elements from token lists.');" when outputting the name servers with CfnOutput
    const joinedNameServers = Fn.join(', ', nameServers);

    new CfnOutput(this, 'HostedZoneNameServers', {
      value: Fn.select(0, joinedNameServers.split(',')) || '',
      description: "The name servers for the domain's hosted zone",
    });
  }
}
