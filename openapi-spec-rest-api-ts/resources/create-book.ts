import { APIGatewayProxyEvent } from 'aws-lambda';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import { paths } from '../types/openapi';

const dynamodb = new DynamoDB({});

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    // If no body, return an error
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing body' }),
      };
    }

    const body = JSON.parse(
      event.body
    ) as paths['/books']['post']['requestBody']['content']['application/json'];
    const uuid = randomUUID();

    await dynamodb.send(
      new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: {
          pk: `BOOK#${uuid}`,
          ...body,
        },
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ id: uuid }),
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: error }),
    };
  }
};
