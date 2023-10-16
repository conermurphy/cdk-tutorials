import { scan } from '@aws-appsync/utils/dynamodb';
import { Context } from '@aws-appsync/utils';
import { Post } from '../types/graphql';

export function request() {
  return scan({});
}

export function response(ctx: Context) {
  const { items } = ctx.result as { items: Post[] };

  return items;
}
