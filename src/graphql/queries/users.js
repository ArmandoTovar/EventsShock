import { gql } from 'apollo-server';
import * as yup from 'yup';
import { findAll } from '../../firebase';
export const typeDefs = gql`
  extend type Query {
    users: [User!]
  }
`;

const argsSchema = yup.object({
  after: yup.string(),
  first: yup.number().min(1).max(30).default(30),
});

export const resolvers = {
  Query: {
    users: async (obj, args) => {
      const data = await findAll('user');
      return data;
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
