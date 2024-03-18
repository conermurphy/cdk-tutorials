import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { paths } from '../types/openapi';

const dynamodb = new DynamoDB({});

export const handler = async () => {
  try {
    const { Items } = await dynamodb.send(
      new ScanCommand({
        TableName: process.env.TABLE_NAME,
      })
    );

    const parsedItems =
      Items as paths['/books']['get']['responses']['200']['content']['application/json'];

    return {
      statusCode: 200,
      body: JSON.stringify(parsedItems),
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
