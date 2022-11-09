import { gql } from 'apollo-server';

export const typeDefs = gql`
  type EventEdge {
    cursor: String!
    node: Event!
  }

  type EventConnection {
    totalCount: Int!
    pageInfo: PageInfo!
    edges: [EventEdge!]!
  }
`;

export const resolvers = {};

export default {
  typeDefs,
  resolvers,
};
