import { get } from '@aws-appsync/utils/dynamodb';
import { Context } from '@aws-appsync/utils';
import { Post, QueryGetPostArgs } from '../types/graphql';

export function request(ctx: Context<QueryGetPostArgs>) {
  return get({
    key: { id: ctx.args.id },
  });
}

export function response(ctx: Context) {
  return ctx.result as Post;
}
