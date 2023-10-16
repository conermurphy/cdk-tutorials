import { remove } from '@aws-appsync/utils/dynamodb';
import { Context } from '@aws-appsync/utils';
import { MutationDeletePostArgs, Post } from '../types/graphql';

export function request(ctx: Context<MutationDeletePostArgs>) {
  return remove({
    key: { id: ctx.args.id },
  });
}

export function response(ctx: Context) {
  return ctx.result as Post;
}
