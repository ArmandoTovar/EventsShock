import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Church {
    id: ID!
    name: String!
    address: String!
    country: String!
    province: String!
    distrite: String!
  }
`;

export const resolvers = {};

export default {
  typeDefs,
  resolvers,
};
