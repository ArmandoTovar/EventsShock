import { gql } from 'apollo-server';
import * as yup from 'yup';
import { findAll, findData } from '../../firebase';

export const typeDefs = gql`
  extend type Query {
    groups(searchKeyword: String, userId: String, id: String): [Group!]
  }
`;

const argsSchema = yup.object({
  userId: yup.string().trim(),
  id: yup.string().trim(),
});

export const resolvers = {
  Query: {
    groups: async (obj, args) => {
      const normalizedArgs = await argsSchema.validate(args);

      const { userId, id } = normalizedArgs;

      let data = [];

      if (userId) {
        data = await findData('group', 'userId', '==', userId);
      } else if (id) {
        data = await findData('group', 'id', '==', id);
      } else {
        data = await findAll('group');
      }
      return data;
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
