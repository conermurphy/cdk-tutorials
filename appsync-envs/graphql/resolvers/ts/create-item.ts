import { Context } from '@aws-appsync/utils';
import { put } from '@aws-appsync/utils/dynamodb';

export function request(ctx: Context) {
  const id = util.autoId();

  // Create a new item in our DB using the secret from the environment variables stored in our API
  return put({
    key: { id },
    // Access the environment variable using `ctx.env`
    item: { value: ctx.env.secret, id },
  });
}

export function response(ctx: Context) {
  return ctx.result;
}
