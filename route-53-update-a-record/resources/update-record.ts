import {
  ChangeResourceRecordSetsCommand,
  ListResourceRecordSetsCommand,
  Route53Client,
} from '@aws-sdk/client-route-53';

const route53 = new Route53Client({});

async function getRecords(zoneId: string) {
  const { ResourceRecordSets } = await route53.send(
    new ListResourceRecordSetsCommand({ HostedZoneId: zoneId })
  );

  if (!ResourceRecordSets) return undefined;

  const aRecords = JSON.stringify(
    ResourceRecordSets?.filter((record) => record.Type === 'A')
  );

  // eslint-disable-next-line no-console
  console.log(aRecords);
}

export const handler = async () => {
  const { zoneId = '', zoneName = '' } = process.env;

  await getRecords(zoneId);

  const params = {
    HostedZoneId: zoneId,
    ChangeBatch: {
      Changes: [
        {
          Action: 'UPSERT',
          ResourceRecordSet: {
            Name: zoneName,
            ResourceRecords: [
              {
                Value: '192.168.1.2',
              },
            ],
            TTL: 1800,
            Type: 'A',
          },
        },
      ],
    },
  };

  await route53.send(new ChangeResourceRecordSetsCommand(params));

  await getRecords(zoneId);
};
