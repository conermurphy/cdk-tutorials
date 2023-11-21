/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from './graphql';
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getPost = /* GraphQL */ `query GetPost($id: ID!) {
  getPost(id: $id) {
    id
    title
    description
    author
    publicationDate
    __typename
  }
}
` as GeneratedQuery<APITypes.GetPostQueryVariables, APITypes.GetPostQuery>;
export const getAllPosts = /* GraphQL */ `query GetAllPosts {
  getAllPosts {
    id
    title
    description
    author
    publicationDate
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetAllPostsQueryVariables,
  APITypes.GetAllPostsQuery
>;
