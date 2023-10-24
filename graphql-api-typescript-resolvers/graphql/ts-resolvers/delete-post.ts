import { remove } from '@aws-appsync/utils/dynamodb';
import { Context } from '@aws-appsync/utils';
import { DeletePostMutationVariables, Post } from '../types/graphql';

export function request(ctx: Context<DeletePostMutationVariables>) {
  return remove({
    key: { id: ctx.args.id },
  });
}

export function response(ctx: Context) {
  const result = ctx.result as Post;

  return result.id;
}
