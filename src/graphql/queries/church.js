import { gql } from 'apollo-server';
import * as yup from 'yup';
import { findAll, findData } from '../../firebase';
export const typeDefs = gql`
  extend type Query {
    church(id: ID, country: String, name: String): [Church!]
  }
`;
const argsSchema = yup.object({
  country: yup.string().trim(),
  name: yup.string().trim(),
});

export const resolvers = {
  Query: {
    church: async (obj, args) => {
      const normalizedArgs = await argsSchema.validate(args);

      const { country, id, name } = normalizedArgs;

      let data = [];

      if (name) {
        data = findData('church', 'name', '==', userId);
      } else if (id) {
        data = findData('church', 'id', '==', id);
      } else if (country) {
        data = findData('church', 'country', '==', id);
      } else {
        data = findAll('church');
      }

      return data;
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
