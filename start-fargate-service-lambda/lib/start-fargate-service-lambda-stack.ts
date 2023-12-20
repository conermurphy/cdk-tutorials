import * as cdk from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Cluster, ContainerImage } from 'aws-cdk-lib/aws-ecs';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class StartFargateServiceLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const clusterName = 'CLUSTER_NAME';
    const serviceName = 'SERVICE_NAME';

    // Create a VPC for our ECS Cluster
    const vpc = new Vpc(this, 'Vpc');

    // Create an ECS Cluster
    const cluster = new Cluster(this, 'EcsCluster', {
      vpc: vpc,
      clusterName,
    });

    // Create a Fargate Service
    const fargateService = new ApplicationLoadBalancedFargateService(
      this,
      'FargateService',
      {
        cluster,
        serviceName,
        cpu: 256,
        memoryLimitMiB: 512,
        desiredCount: 1,
        taskImageOptions: {
          image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        },
      }
    );

    // Create a Lambda function to start the Fargate Service
    const startServiceLambda = new NodejsFunction(this, 'StartServiceLambda', {
      entry: 'resources/start-service.ts',
      handler: 'handler',
      environment: {
        CLUSTER: clusterName,
        SERVICE: serviceName,
        REGION: this.region,
      },
    });

    // Give the Lambda function permission to start the Fargate Service
    const ecsPolicy = new Policy(this, 'EcsPolicy', {
      statements: [
        new PolicyStatement({
          actions: ['ecs:UpdateService', 'ecs:DescribeServices'],
          resources: [fargateService.service.serviceArn],
        }),
      ],
    });

    // Attach the policy to the Lambda function's role
    startServiceLambda.role?.attachInlinePolicy(ecsPolicy);
  }
}
