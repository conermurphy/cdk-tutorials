import { Stack, StackProps, RemovalPolicy, Duration } from 'aws-cdk-lib';
import { AttributeType, Table, BillingMode } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export class DynamodbCompressionStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // 👇 Define the DynamoDB Instance
    const dbTable = new Table(this, `DynamoDBTable`, {
      partitionKey: { name: 'author', type: AttributeType.STRING },
      sortKey: { name: 'title', type: AttributeType.STRING },
      timeToLiveAttribute: 'expires',
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    // 👇 Add Global Secondary Index for the dbTable
    dbTable.addGlobalSecondaryIndex({
      indexName: 'GSI1',
      partitionKey: { name: 'date', type: AttributeType.STRING },
      sortKey: { name: 'author', type: AttributeType.STRING },
    });

    // 👇 Define the Write Lambda
    const writeHandler = new NodejsFunction(this, 'WriteHandler', {
      runtime: Runtime.NODEJS_18_X,
      entry: './resources/write-handler.ts',
      handler: 'handler',
      timeout: Duration.seconds(30),
      environment: {
        TABLE_NAME: dbTable.tableName,
      },
    });

    // 👇 Give write permissions to lambdas
    dbTable.grantWriteData(writeHandler);

    // 👇 Define the Read Lambda
    const readHandler = new NodejsFunction(this, 'ReadHandler', {
      runtime: Runtime.NODEJS_18_X,
      entry: './resources/read-handler.ts',
      handler: 'handler',
      timeout: Duration.seconds(30),
      environment: {
        TABLE_NAME: dbTable.tableName,
      },
    });

    // 👇 Give read permissions to lambdas
    dbTable.grantReadData(readHandler);
  }
}
