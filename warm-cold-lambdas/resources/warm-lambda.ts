import { EventBridgeEvent } from 'aws-lambda';

export const handler = (
  event: EventBridgeEvent<
    string,
    {
      source: string;
    }
  >
) => {
  if (event.source === 'aws.events') {
    return;
  }

  // eslint-disable-next-line no-console
  console.log('Hi! I am a warm Lambda function.');
};
