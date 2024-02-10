import * as cdk from 'aws-cdk-lib';
import { Peer, Port, SecurityGroup, SubnetType } from 'aws-cdk-lib/aws-ec2';
import {
  Cluster,
  ContainerImage,
  CpuArchitecture,
  FargateService,
  FargateTaskDefinition,
  LogDrivers,
  OperatingSystemFamily,
} from 'aws-cdk-lib/aws-ecs';
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { FunctionUrlAuthType, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export class MigrateLambdaToEcsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // === LAMBDA CODE ===

    // 1. Create starting example Lambda function
    const lambda = new NodejsFunction(this, 'EXAMPLE_LAMBDA', {
      entry: 'resources/lambda.ts',
      handler: 'handler',
      runtime: Runtime.NODEJS_20_X,
    });

    const functionURL = lambda.addFunctionUrl({
      // Removing the authType will allow us to test the function without any authentication
      authType: FunctionUrlAuthType.NONE,
    });

    new cdk.CfnOutput(this, 'LAMBDA_FUNCTION_URL', {
      value: functionURL.url,
    });

    // === ECS CODE ===

    // 2. Create a new ECS cluster
    const cluster = new Cluster(this, 'ECS_EXAMPLE_CLUSTER');

    // 3. Create a security group for the task which allows outbound connections
    const securityGroup = new SecurityGroup(this, 'TaskSecurityGroup', {
      vpc: cluster.vpc,
      allowAllOutbound: true,
    });

    // 3a. Allow inbound traffic on port 3000 for our express server
    securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(3000));

    // 4. Create a new execution role for our task to use to allow it to pull from private ECR repos
    const executionRole = new Role(this, 'TaskExecutionRole', {
      assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AmazonECSTaskExecutionRolePolicy'
        ),
      ],
    });

    // 5. Define the task definition
    const taskDefinition = new FargateTaskDefinition(
      this,
      'FARGATE_TASK_DEFINITION',
      {
        executionRole,
        runtimePlatform: {
          operatingSystemFamily: OperatingSystemFamily.LINUX,
          /**
           * Change this to align with the machine you're building on.
           * E.g. Apple Silicon (M*) === ARM64
           */
          cpuArchitecture: CpuArchitecture.ARM64,
        },
      }
    );

    // Reference our Docker image from ECR.
    // Replace this with your own ECR image URL using the format:
    // <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/<REPO_NAME>:<TAG>
    const image = ContainerImage.fromRegistry('YOUR_IMAGE_URL');

    // 6. Define our container
    const container = taskDefinition.addContainer('WEB_SERVER_CONTAINER', {
      image,
      memoryLimitMiB: 512,
      cpu: 256,
      logging: LogDrivers.awsLogs({ streamPrefix: 'EXAMPLE_APP' }),
    });

    // 7. Map the container port to the one we exposed in the Dockerfile
    container.addPortMappings({
      containerPort: 3000,
    });

    // 8. Create a Fargate service
    new FargateService(this, 'WEB_SERVER_FARGATE_SERVICE', {
      cluster,
      taskDefinition,
      // Assign a public IP to our ECS task so we can easily test it from Postman
      assignPublicIp: true,
      vpcSubnets: { subnetType: SubnetType.PUBLIC },
      // Use the security group we defined earlier
      securityGroups: [securityGroup],
    });
  }
}
