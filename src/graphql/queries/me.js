import { gql } from 'apollo-server';

export const typeDefs = gql`
  extend type Query {
    me: User
  }
`;

export const resolvers = {
  Query: {
    me: (obj, args, { authService }) => {
      return authService.getUser();
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
