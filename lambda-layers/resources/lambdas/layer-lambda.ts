import { loremIpsum } from 'opt/nodejs/loremIpsum';

export const handler = () => {
  const loremIpsumText = loremIpsum({
    count: 3,
    units: 'paragraphs',
    format: 'plain',
    sentenceLowerBound: 5,
    sentenceUpperBound: 15,
    paragraphLowerBound: 3,
    paragraphUpperBound: 7,
  });

  // eslint-disable-next-line no-console
  console.log('text', loremIpsumText);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: loremIpsumText,
    }),
  };
};
