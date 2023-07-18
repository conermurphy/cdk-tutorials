import { EventBridgeEvent } from 'aws-lambda';

export const handler = (
  event: EventBridgeEvent<
    string,
    {
      source: string;
    }
  >
) => {
  // If triggered by the cron job, return early from the function
  if (event.source === 'aws.events') {
    return;
  }

  // eslint-disable-next-line no-console
  console.log('Hi! I am a warm Lambda function.');
};
