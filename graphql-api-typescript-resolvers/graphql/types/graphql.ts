/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreatePostInput = {
  id?: string | null;
  title: string;
  description: string;
  author: string;
  publicationDate: string;
};

export type Post = {
  __typename: 'Post';
  id: string;
  title: string;
  description: string;
  author: string;
  publicationDate: string;
};

export type CreatePostMutationVariables = {
  input: CreatePostInput;
};

export type CreatePostMutation = {
  createPost?: {
    __typename: 'Post';
    id: string;
    title: string;
    description: string;
    author: string;
    publicationDate: string;
  } | null;
};

export type DeletePostMutationVariables = {
  id: string;
};

export type DeletePostMutation = {
  deletePost?: string | null;
};

export type GetPostQueryVariables = {
  id: string;
};

export type GetPostQuery = {
  getPost?: {
    __typename: 'Post';
    id: string;
    title: string;
    description: string;
    author: string;
    publicationDate: string;
  } | null;
};

export type GetAllPostsQuery = {
  getAllPosts?: Array<{
    __typename: 'Post';
    id: string;
    title: string;
    description: string;
    author: string;
    publicationDate: string;
  } | null> | null;
};
