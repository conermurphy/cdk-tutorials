import { EventBridge } from 'aws-sdk';

const eventBridge = new EventBridge();

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const handler = async () => {
  const { EVENT_BUS_ARN } = process.env;

  // Generate a random number between 0 and 10
  const number = randomNumber(0, 10);

  // eslint-disable-next-line no-console
  console.log(`=== NUMBER GENERATOR OUTPUT: ${number} ===`);

  // Create a new event on the eventBridge
  await eventBridge
    .putEvents({
      Entries: [
        {
          Source: 'example-source',
          DetailType: number % 2 ? 'odd' : 'even',
          EventBusName: EVENT_BUS_ARN,
          Detail: JSON.stringify({
            generatedNumber: number,
          }),
        },
      ],
    })
    .promise();
};
