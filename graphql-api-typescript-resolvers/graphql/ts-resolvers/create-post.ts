import { put } from '@aws-appsync/utils/dynamodb';
import { Context, util } from '@aws-appsync/utils';
import { CreatePostMutationVariables, Post } from '../types/graphql';

export function request(ctx: Context<CreatePostMutationVariables>) {
  return put({
    key: { id: util.autoId() },
    item: ctx.args.input,
  });
}

export function response(ctx: Context) {
  return ctx.result as Post;
}
