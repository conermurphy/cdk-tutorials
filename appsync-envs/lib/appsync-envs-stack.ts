import * as cdk from 'aws-cdk-lib';
import {
  CfnApiKey,
  CfnDataSource,
  CfnGraphQLApi,
  CfnGraphQLSchema,
  CfnResolver,
} from 'aws-cdk-lib/aws-appsync';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { readFileSync } from 'fs';

export class AppsyncEnvsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a new DynamoDB table
    const table = new Table(this, 'appsync-envs-table', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Create a new GraphQL API using CfnGraphQLApi as GraphQLApi does not support environment variables yet
    const api = new CfnGraphQLApi(this, 'appsync-envs-graphql-api', {
      name: 'appsync-envs-api',
      environmentVariables: {
        // Define any environment variables to be added to the API
        secret: 'some-secret-value',
      },
      authenticationType: 'API_KEY',
    });

    // Create a new API key for our GraphQL API
    const apiKey = new CfnApiKey(this, 'appsync-envs-api-key', {
      apiId: api.attrApiId,
      // Time expires time is based on epoch time
      expires: 1709238244,
    });

    // Add the schema to our API
    new CfnGraphQLSchema(this, 'appsync-envs-schema', {
      apiId: api.attrApiId,
      definition: readFileSync('./graphql/schema.graphql', 'utf-8'),
    });

    // Create a new IAM role for our DB table for AppSync to use
    const dataSourceRole = new Role(this, 'appsync-envs-datasource-role', {
      assumedBy: new ServicePrincipal('appsync.amazonaws.com'),
    });

    // Attach the required DynamoDB permissions to our role
    dataSourceRole.addToPolicy(
      new PolicyStatement({
        actions: [
          'dynamodb:Query',
          'dynamodb:GetItem',
          'dynamodb:Scan',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem',
        ],
        resources: [table.tableArn],
      })
    );

    // Create a new data source to link our API and DB together
    const dataSource = new CfnDataSource(this, 'appsync-envs-data-source', {
      apiId: api.attrApiId,
      name: 'appsyncEnvsDataSource',
      type: 'AMAZON_DYNAMODB',
      dynamoDbConfig: {
        tableName: table.tableName,
        awsRegion: this.region,
      },
      serviceRoleArn: dataSourceRole.roleArn,
    });

    // Create a new JS resolver (built from the TS file) for our API
    const createItemResolver = new CfnResolver(
      this,
      'appsync-envs-create-item-resolver',
      {
        apiId: api.attrApiId,
        typeName: 'Mutation',
        fieldName: 'createItem',
        dataSourceName: dataSource.name,
        runtime: {
          name: 'APPSYNC_JS',
          runtimeVersion: '1.0.0',
        },
        code: readFileSync('./graphql/resolvers/js/create-item.js', 'utf-8'),
      }
    );

    const getItemResolver = new CfnResolver(
      this,
      'appsync-envs-get-item-resolver',
      {
        apiId: api.attrApiId,
        typeName: 'Query',
        fieldName: 'getItem',
        dataSourceName: dataSource.name,
        runtime: {
          name: 'APPSYNC_JS',
          runtimeVersion: '1.0.0',
        },
        code: readFileSync('./graphql/resolvers/js/get-item.js', 'utf-8'),
      }
    );

    // Add a dependency to both resolvers so they are created after the data source
    createItemResolver.addDependency(dataSource);
    getItemResolver.addDependency(dataSource);

    // Output our API URL and API key value
    new cdk.CfnOutput(this, 'appsync-envs-output', {
      value: JSON.stringify({
        url: api.attrGraphQlUrl,
        apiKey: apiKey.attrApiKey,
      }),
    });
  }
}
