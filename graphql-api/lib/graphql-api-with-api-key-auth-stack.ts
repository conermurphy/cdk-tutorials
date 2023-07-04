import {
  Expiration,
  Stack,
  StackProps,
  Duration,
  CfnOutput,
  RemovalPolicy,
} from 'aws-cdk-lib';
import {
  GraphqlApi,
  AuthorizationType,
  SchemaFile,
  MappingTemplate,
} from 'aws-cdk-lib/aws-appsync';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class GraphqlApiWithApiKeyAuthStack extends Stack {
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
      schema: SchemaFile.fromAsset('./graphql/schema.graphql'),
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

    // 4. Create our resolvers for queries
    // 4a. Create a resolver for the `getPost` query
    dataSource.createResolver('get-post-query', {
      typeName: 'Query',
      fieldName: 'getPost',
      requestMappingTemplate: MappingTemplate.fromFile(
        './graphql/resolvers/Query.getPost.req.vtl'
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        './graphql/resolvers/Query.getPost.res.vtl'
      ),
    });

    // 4b. Create a resolver for the `getAllPosts` query
    dataSource.createResolver('get-all-posts-query', {
      typeName: 'Query',
      fieldName: 'getAllPosts',
      requestMappingTemplate: MappingTemplate.fromFile(
        './graphql/resolvers/Query.getAllPosts.req.vtl'
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        './graphql/resolvers/Query.getAllPosts.res.vtl'
      ),
    });

    // 4c. Create a resolver for the `createPost` mutation
    dataSource.createResolver('create-post-mutation', {
      typeName: 'Mutation',
      fieldName: 'createPost',
      requestMappingTemplate: MappingTemplate.fromFile(
        './graphql/resolvers/Mutation.createPost.req.vtl'
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        './graphql/resolvers/Mutation.createPost.res.vtl'
      ),
    });

    // 4d. Create a resolver for the `deletePost` mutation
    dataSource.createResolver('delete-post-mutation', {
      typeName: 'Mutation',
      fieldName: 'deletePost',
      requestMappingTemplate: MappingTemplate.fromFile(
        './graphql/resolvers/Mutation.deletePost.req.vtl'
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        './graphql/resolvers/Mutation.deletePost.res.vtl'
      ),
    });

    // Misc. Outputs
    new CfnOutput(this, 'ApiKeyOutput', {
      value: api.apiKey || '',
    });

    new CfnOutput(this, 'ApiUrl', {
      value: api.graphqlUrl || '',
    });
  }
}
