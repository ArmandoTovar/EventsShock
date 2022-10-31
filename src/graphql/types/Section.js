import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Section {
    id: ID!
    parent: String!
    activeMembers: [String!]
    initialDate: DateTime!
    state: Int!
  }
`;

export const resolvers = {
  Section: {
    state: async (obj, args, { authService }) => {
      return 0;
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
