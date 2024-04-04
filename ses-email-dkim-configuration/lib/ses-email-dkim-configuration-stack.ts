import * as cdk from 'aws-cdk-lib';
import { EmailIdentity, Identity } from 'aws-cdk-lib/aws-ses';
import { Construct } from 'constructs';

export class SesEmailDkimConfigurationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. Define our email address and it's domain that we want to use with SES
    const email = 'example@example.com';
    const domain = 'example.com';
    const domainIdentity = Identity.domain(domain);
    const emailIdentity = Identity.email(email);

    // 2. Create the new domain Identity on SES, ensuring `dkimSigning` is true
    const sesDomainIdentity = new EmailIdentity(this, 'DomainIdentity', {
      identity: domainIdentity,
      dkimSigning: true,
    });

    // 3. Create the new email Identity on SES
    new EmailIdentity(this, 'EmailIdentity', {
      identity: emailIdentity,
    });

    // 4. Print out the DKIM CNAME records to add to our DNS
    new cdk.CfnOutput(this, 'DkimRecordOutputs', {
      value: JSON.stringify(sesDomainIdentity.dkimRecords),
    });
  }
}
