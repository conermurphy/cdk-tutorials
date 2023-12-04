async function rateLimit() {
  const API_URL = 'API_URL';

  while (true) {
    const res = await fetch(API_URL);

    // eslint-disable-next-line no-console
    console.log(res.status);

    if (res.status === 403) {
      // eslint-disable-next-line no-console
      console.log('Rate limit exceeded');
      break;
    }
  }
}

rateLimit();
