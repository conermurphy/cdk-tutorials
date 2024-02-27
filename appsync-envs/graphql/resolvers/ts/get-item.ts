import { Context } from '@aws-appsync/utils';
import { get } from '@aws-appsync/utils/dynamodb';

export function request(ctx: Context) {
  return get({
    key: { id: ctx.args.id },
  });
}

export function response(ctx: Context) {
  return ctx.result;
}
