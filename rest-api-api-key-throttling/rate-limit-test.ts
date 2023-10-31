async function rateLimit() {
  const API_URL = 'YOUR_API_URL';
  const API_KEY = 'YOUR_API_KEY';

  while (true) {
    const res = await fetch(API_URL, {
      headers: {
        'x-api-key': API_KEY,
      },
    });

    // eslint-disable-next-line no-console
    console.log(res.status);

    if (res.status === 429) {
      // eslint-disable-next-line no-console
      console.log('Rate limit exceeded');
      break;
    }
  }
}

rateLimit();
