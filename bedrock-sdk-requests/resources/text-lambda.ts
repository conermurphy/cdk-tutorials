import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';

const client = new BedrockRuntimeClient();

export const handler = async () => {
  const input = {
    body: JSON.stringify({
      prompt:
        'Write me a story about a car that goes on a journey to save a village',
      max_tokens: 400,
      temperature: 0.75,
      p: 0.01,
      k: 0,
      stop_sequences: [],
      return_likelihoods: 'NONE',
    }),
    accept: 'application/json',
    contentType: 'application/json',
    modelId: 'cohere.command-text-v14',
  };

  const command = new InvokeModelCommand(input);

  try {
    const response = await client.send(command);

    const { generations } = JSON.parse(
      new TextDecoder().decode(response.body)
    ) as {
      generations: {
        finish_reason: string;
        id: string;
        text: string;
      }[];
    };

    return {
      statusCode: 200,
      body: generations,
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: e,
    };
  }
};
