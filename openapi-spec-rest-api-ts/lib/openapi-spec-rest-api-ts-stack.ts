import { RemovalPolicy, CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AttributeType, Table, BillingMode } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import {
  ApiDefinition,
  ApiKey,
  SpecRestApi,
  UsagePlan,
} from 'aws-cdk-lib/aws-apigateway';
import { readFileSync } from 'fs';
import path from 'path';
import Mustache from 'mustache';
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam';

export class OpenapiSpecRestApiTsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // 1. Create a new DynamoDB database
    const booksDb = new Table(this, 'BooksDbTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    // 2. Create the POST lambda function
    const createBookLambda = new NodejsFunction(this, 'CreateBookLambda', {
      entry: 'resources/create-book.ts',
      handler: 'handler',
      environment: {
        TABLE_NAME: booksDb.tableName,
      },
    });

    // 3. Create the GET lambda function
    const getAllBooksLambda = new NodejsFunction(this, 'GetAllBooksLambda', {
      entry: 'resources/get-all-books.ts',
      handler: 'handler',
      environment: {
        TABLE_NAME: booksDb.tableName,
      },
    });

    // 4. Grant permissions to the lambda functions
    booksDb.grantReadWriteData(createBookLambda);
    booksDb.grantReadWriteData(getAllBooksLambda);

    getAllBooksLambda.addPermission('InvokeByApiGateway', {
      principal: new ServicePrincipal('apigateway.amazonaws.com'),
    });

    createBookLambda.addPermission('InvokeByApiGateway', {
      principal: new ServicePrincipal('apigateway.amazonaws.com'),
    });

    // 5. Define the variables to replace in the OpenAPI spec file
    const variables = {
      region: 'eu-west-2',
      post_function_arn: createBookLambda.functionArn,
      get_all_function_arn: getAllBooksLambda.functionArn,
    };

    const openApiSpecJson = this.resolve(
      Mustache.render(
        readFileSync(path.join(__dirname, '../openapi-spec.json'), 'utf-8'),
        variables
      )
    );

    // 6. Define the REST API from the spec file
    const booksApi = new SpecRestApi(this, 'BooksAPI', {
      apiDefinition: ApiDefinition.fromInline(openApiSpecJson),
    });

    // 8. Add an API key
    const apiKey = new ApiKey(this, 'ApiKey');

    const booksUsagePlan = new UsagePlan(this, 'BooksApiUsagePlan', {
      name: 'Books Usage Plan',
      apiStages: [
        {
          api: booksApi,
          stage: booksApi.deploymentStage,
        },
      ],
    });

    booksUsagePlan.addApiKey(apiKey);

    // 9. Log out the API URL and API key
    new CfnOutput(this, 'api-values-output', {
      value: JSON.stringify({
        apiKey: apiKey.keyId,
      }),
    });
  }
}
