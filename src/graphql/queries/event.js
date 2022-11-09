import { gql } from 'apollo-server';

export const typeDefs = gql`
  extend type Query {
    event(id: ID!): Event
  }
`;

export const resolvers = {
  Query: {
    event: async (obj, args, { dataLoaders: { eventLoader } }) => {
      return eventLoader.load(args.id);
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
