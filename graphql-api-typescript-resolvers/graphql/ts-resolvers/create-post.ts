import { put } from '@aws-appsync/utils/dynamodb';
import { Context, util } from '@aws-appsync/utils';
import { MutationCreatePostArgs, Post } from '../types/graphql';

export function request(ctx: Context<MutationCreatePostArgs>) {
  return put({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    key: { id: util.autoId() },
    item: ctx.args.input,
  });
}

export function response(ctx: Context) {
  return ctx.result as Post;
}
