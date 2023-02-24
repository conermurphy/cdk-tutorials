import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { gunzipSync } from 'zlib';

const dynamodb = new DynamoDB({});

export const handler = async () => {
  const { TABLE_NAME } = process.env;

  // Uncompressed read to DB
  const {
    ConsumedCapacity: uncompressedConsumedCapacity,
    Item: uncompressedItem,
  } = await dynamodb.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        author: 'cmurphy',
        title: 'uncompressed',
      },
      ReturnConsumedCapacity: 'TOTAL',
    })
  );

  // Compressed read to DB
  const { ConsumedCapacity: compressedConsumedCapacity, Item: compressedItem } =
    await dynamodb.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: {
          author: 'cmurphy',
          title: 'compressed',
        },
        ReturnConsumedCapacity: 'TOTAL',
      })
    );

  const compressedTextOutput = gunzipSync(
    compressedItem?.content as Buffer
  ).toString();

  /* eslint-disable no-console */
  console.log(
    `UNCOMPRESSED: Consumed RCU's => ${uncompressedConsumedCapacity?.CapacityUnits}`
  );
  console.log(
    `UNCOMPRESSED: length of text => ${
      (uncompressedItem?.content as string)?.length
    } characters`
  );
  console.log(
    `COMPRESSED: Consumed RCU's => ${compressedConsumedCapacity?.CapacityUnits}`
  );
  console.log(
    `COMPRESSED: length of text => ${compressedTextOutput?.length} characters`
  );
  /* eslint-enable no-console */
};
