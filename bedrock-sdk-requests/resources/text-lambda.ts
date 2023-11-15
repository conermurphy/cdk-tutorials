import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';

// Create a new Bedrock SDK Client
const client = new BedrockRuntimeClient();

export const handler = async () => {
  // Configure the input for the request to our Bedrock model.
  const input = {
    // NOTE: The body differs depending on the model you are using so use the playground on the Bedrock dashboard to figure out what you need to include.
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
    // The model you'd like to use
    modelId: 'cohere.command-text-v14',
  };

  try {
    // Send the request to the Bedrock model
    const response = await client.send(new InvokeModelCommand(input));

    // Process the output from the Bedrock model and return the generated data.
    // NOTE: The structure of the response also differs depending on the model used.
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
      body: generations[0].text,
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: e,
    };
  }
};
