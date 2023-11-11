import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { BlockPublicAccess, Bucket, HttpMethods } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class BedrockSdkRequestsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // 1. Define our Lambda function for text generation
    new NodejsFunction(this, 'TextLambda', {
      entry: 'resources/text-lambda.ts',
      handler: 'handler',
      runtime: Runtime.NODEJS_18_X,
      timeout: Duration.minutes(3),
      bundling: {
        nodeModules: ['@aws-sdk/client-bedrock-runtime'],
      },
      initialPolicy: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['bedrock:*'],
          resources: [`*`],
        }),
      ],
    });

    // 2. Define our S3 bucket for storing images
    const s3Bucket = new Bucket(this, 'ImageBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      publicReadAccess: true,
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
      cors: [
        {
          allowedHeaders: ['*'],
          allowedMethods: [HttpMethods.GET],
          allowedOrigins: ['*'],
          exposedHeaders: [],
          maxAge: 3000,
        },
      ],
    });

    // 3. Define our Lambda function for image generation
    new NodejsFunction(this, 'ImageLambda', {
      entry: 'resources/image-lambda.ts',
      handler: 'handler',
      runtime: Runtime.NODEJS_18_X,
      timeout: Duration.minutes(3),
      bundling: {
        nodeModules: ['@aws-sdk/client-bedrock-runtime', '@aws-sdk/client-s3'],
      },
      environment: {
        S3_BUCKET_NAME: s3Bucket.bucketName,
      },
      initialPolicy: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['bedrock:*', 's3:*'],
          resources: [`*`],
        }),
      ],
    });
  }
}
