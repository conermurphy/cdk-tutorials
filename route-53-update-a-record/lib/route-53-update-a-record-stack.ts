import { Stack, StackProps } from 'aws-cdk-lib';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ARecord, HostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';

export class Route53UpdateARecordStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const domain = 'yourdomain.com';

    // Define the Route53 hosted zone for our domain
    const domainHostedZone = new HostedZone(this, 'DomainHostedZone', {
      zoneName: domain,
    });

    // Define a new A record for our domain to be updated by our lambda function
    const aRecord = new ARecord(this, 'ARecord', {
      target: {
        values: ['192.168.1.1'],
      },
      recordName: domain,
      zone: domainHostedZone,
    });

    // Add a dependency on the A Record to ensure that is removed first when the stack is deleted.
    aRecord.node.addDependency(domainHostedZone);

    // Define our IAM permissions for our lambda function
    const route53Permission = new PolicyStatement({
      actions: [
        'route53:ListResourceRecordSetsCommand',
        'route53:ChangeResourceRecordSets',
        'route53:ListResourceRecordSets',
      ],
      resources: [
        `arn:aws:route53:::hostedzone/${domainHostedZone.hostedZoneId}`,
      ],
    });

    // Define our lambda to update the IP of our A Record
    const updateRecordLambda = new NodejsFunction(this, 'UpdateRecordLambda', {
      memorySize: 1024,
      runtime: Runtime.NODEJS_16_X,
      handler: 'handler',
      entry: `./resources/update-record.ts`,
      environment: {
        zoneId: domainHostedZone.hostedZoneId,
        zoneName: domainHostedZone.zoneName,
      },
    });

    // Add our route53 permissions to our lambda function
    updateRecordLambda.addToRolePolicy(route53Permission);
  }
}
