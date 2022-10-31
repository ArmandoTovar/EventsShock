import { gql } from 'apollo-server';

export const typeDefs = gql`
  extend type Query {
    section(id: ID!): Section
  }
`;

export const resolvers = {
  Query: {
    section: async (obj, args, { dataLoaders: { sectionLoader } }) =>
      sectionLoader.load(args.id),
  },
};

export default {
  typeDefs,
  resolvers,
};
