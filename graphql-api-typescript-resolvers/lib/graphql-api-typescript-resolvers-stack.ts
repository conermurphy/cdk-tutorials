import {
  CfnOutput,
  Duration,
  Expiration,
  RemovalPolicy,
  Stack,
  StackProps,
} from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import {
  GraphqlApi,
  AuthorizationType,
  FunctionRuntime,
  Code,
  Definition,
} from 'aws-cdk-lib/aws-appsync';
import path = require('path');

export class GraphqlApiTypescriptResolversStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // 1. Create a new DynamoDB table
    const table = new Table(this, 'posts-db', {
      tableName: 'graphql-posts-db',
      partitionKey: { name: 'id', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // 2. Create an AppSync GraphQL API
    const api = new GraphqlApi(this, 'graphql-api', {
      name: 'graphql-api',
      definition: Definition.fromFile(
        path.join(__dirname, '../graphql/schema.graphql')
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: Expiration.after(Duration.days(365)),
          },
        },
      },
    });

    // 3. Link the GraphQL API with the DynamoDB table
    const dataSource = api.addDynamoDbDataSource('post-db-source', table);

    // 4. Defining our AppSync Resolvers
    dataSource.createResolver('getOnePostResolver', {
      typeName: 'Query',
      fieldName: 'getPost',
      runtime: FunctionRuntime.JS_1_0_0,
      code: Code.fromAsset(
        path.join(__dirname, '../graphql/js-resolvers/get-one-post.js')
      ),
    });

    dataSource.createResolver('getAllPostsResolver', {
      typeName: 'Query',
      fieldName: 'getAllPosts',
      runtime: FunctionRuntime.JS_1_0_0,
      code: Code.fromAsset(
        path.join(__dirname, '../graphql/js-resolvers/get-all-posts.js')
      ),
    });

    dataSource.createResolver('createPostResolver', {
      typeName: 'Mutation',
      fieldName: 'createPost',
      runtime: FunctionRuntime.JS_1_0_0,
      code: Code.fromAsset(
        path.join(__dirname, '../graphql/js-resolvers/create-post.js')
      ),
    });

    dataSource.createResolver('deletePostResolver', {
      typeName: 'Mutation',
      fieldName: 'deletePost',
      runtime: FunctionRuntime.JS_1_0_0,
      code: Code.fromAsset(
        path.join(__dirname, '../graphql/js-resolvers/delete-post.js')
      ),
    });

    // Misc. Outputs
    new CfnOutput(this, 'api-key-output', {
      value: api.apiKey || '',
    });

    new CfnOutput(this, 'api-url', {
      value: api.graphqlUrl || '',
    });
  }
}
