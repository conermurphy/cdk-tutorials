import {
  DescribeServicesCommand,
  ECSClient,
  UpdateServiceCommand,
} from '@aws-sdk/client-ecs';

const REGION = process.env.REGION;
const CLUSTER = process.env.CLUSTER;
const SERVICE = process.env.SERVICE;

export async function handler() {
  const ecs = new ECSClient({ region: REGION });

  if (REGION == null || CLUSTER == null || SERVICE == null) {
    throw new Error('Missing environment variables');
  }

  const response = await ecs.send(
    new DescribeServicesCommand({
      cluster: CLUSTER,
      services: [SERVICE],
    })
  );

  const desired = response?.services?.[0].desiredCount;

  if (desired === 0) {
    await ecs.send(
      new UpdateServiceCommand({
        cluster: CLUSTER,
        service: SERVICE,
        desiredCount: 1,
      })
    );

    console.log('Updated desiredCount to 1');
  } else {
    console.log('desiredCount already at 1');
  }
}
