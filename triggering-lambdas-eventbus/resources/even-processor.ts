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

  const numberCubed = generatedNumber * generatedNumber * generatedNumber;

  // eslint-disable-next-line no-console
  console.log(`=== EVEN NUMBER OUTPUT: ${numberCubed} ===`);
};
