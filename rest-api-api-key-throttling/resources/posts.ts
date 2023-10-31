// eslint-disable-next-line
export const handler = async () => {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify([
        {
          id: '1',
          title: 'My first blog post',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },
        {
          id: '2',
          title: 'My second blog post',
          content:
            'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        },
      ]),
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: error }),
    };
  }
};
