import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { loremIpsum } from 'lorem-ipsum';
import { gzipSync } from 'zlib';

const dynamodb = new DynamoDB({});

export const handler = async () => {
  const { TABLE_NAME } = process.env;

  const date = new Date();
  const todayISO = date.toISOString().split('T')[0];

  const text = loremIpsum({
    count: 100,
    units: 'paragraph',
    format: 'plain',
  });

  const compressedText = gzipSync(text);

  // Uncompressed write to DB
  const { ConsumedCapacity: uncompressedConsumedCapacity } =
    await dynamodb.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          author: 'cmurphy',
          title: 'uncompressed',
          content: text,
          date: todayISO,
        },
        ReturnConsumedCapacity: 'TOTAL',
      })
    );

  // Compressed write to DB
  const { ConsumedCapacity: compressedConsumedCapacity } = await dynamodb.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        author: 'cmurphy',
        title: 'compressed',
        content: compressedText,
        date: todayISO,
      },
      ReturnConsumedCapacity: 'TOTAL',
    })
  );

  /* eslint-disable no-console */
  console.log(
    `UNCOMPRESSED: Consumed WCU's => ${uncompressedConsumedCapacity?.CapacityUnits}`
  );
  console.log(`UNCOMPRESSED: data size ~ ${Math.round(text.length / 1024)} KB`);
  console.log(
    `COMPRESSED: Consumed WCU's => ${compressedConsumedCapacity?.CapacityUnits}`
  );
  console.log(
    `COMPRESSED: data size ~ ${Math.round(compressedText.length / 1024)} KB`
  );
  /* eslint-enable no-console */
};
