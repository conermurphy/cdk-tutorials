import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const bedrockClient = new BedrockRuntimeClient();
const s3Client = new S3Client();

export const handler = async () => {
  const { S3_BUCKET_NAME = '' } = process.env;

  const prompt = 'Developer making an application';
  const fileName = `${prompt.toLowerCase().replaceAll(' ', '_')}.jpg`;

  const input = {
    body: JSON.stringify({
      text_prompts: [
        {
          text: prompt,
        },
      ],
      cfg_scale: 10,
      seed: 0,
      steps: 50,
    }),
    accept: 'application/json',
    contentType: 'application/json',
    modelId: 'stability.stable-diffusion-xl-v0',
  };

  const command = new InvokeModelCommand(input);

  try {
    const response = await bedrockClient.send(command);

    // 1. Get our Base 64 encoded image from the response
    const { artifacts } = JSON.parse(
      new TextDecoder().decode(response.body)
    ) as {
      result: string;
      artifacts: {
        seed: string;
        base64: string;
        finishReason: string;
      }[];
    };

    const imageBase64 = artifacts[0].base64;

    // 2. Decode the Base 64 encoded image
    const decodedImage: Buffer = Buffer.from(imageBase64, 'base64');

    // 3. Upload the image to S3
    await s3Client.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: fileName,
        Body: decodedImage,
      })
    );

    // 4. Create the URL of the image
    const imageUrl = `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;

    // 5. Return the URL of the image
    return {
      statusCode: 200,
      body: imageUrl,
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: e,
    };
  }
};
