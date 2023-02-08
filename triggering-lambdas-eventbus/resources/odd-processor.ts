import { EventBridgeEvent } from 'aws-lambda';

export const handler = (
  event: EventBridgeEvent<
    string,
    {
      generatedNumber: number;
    }
  >
) => {
  // 👇 Retrieve our generated number from the event detail that triggered the function
  const {
    detail: { generatedNumber },
  } = event;

  const numberSquared = generatedNumber * generatedNumber;

  // eslint-disable-next-line no-console
  console.log(`=== ODD NUMBER OUTPUT: ${numberSquared} ===`);
};
