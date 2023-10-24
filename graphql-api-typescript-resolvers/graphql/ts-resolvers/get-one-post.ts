import { get } from '@aws-appsync/utils/dynamodb';
import { Context } from '@aws-appsync/utils';
import { Post, GetPostQueryVariables } from '../types/graphql';

export function request(ctx: Context<GetPostQueryVariables>) {
  return get({
    key: { id: ctx.args.id },
  });
}

export function response(ctx: Context) {
  return ctx.result as Post;
}
