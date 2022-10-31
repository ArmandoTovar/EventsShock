import { gql, ApolloError, churchInputError } from 'apollo-server';
import * as yup from 'yup';

import bcrypt from 'bcrypt';
import { addData, findData, signUp } from '../../firebase';
import { v4 as uuid } from 'uuid';
export const typeDefs = gql`
  input CreatechurchInput {
    name: String!
    address: String!
    country: String!
    province: String!
    distrite: String!
  }

  extend type Mutation {
    createchurch(church: CreatechurchInput): Church
  }
`;

class NameTakenError extends ApolloError {
  constructor(message, properties) {
    super(message, 'USERNAME_TAKEN', properties);
  }

  static fromName(name) {
    return new NameTakenError(
      `Name "${name}" is already taken. Choose another name`,
      { name },
    );
  }
}
const argsSchema = yup.object().shape({
  church: yup.object().shape({
    name: yup.string('').min(3).max(30).required(),
    address: yup.string().min(3).max(30).required(),
    country: yup.string().min(3).max(30).required(),
    province: yup.string().min(3).max(30).required(),
    distrite: yup.string().min(3).max(30).required(),
  }),
});

export const resolvers = {
  Mutation: {
    createchurch: async (obj, args, { authService }) => {
      const currentUser = await authService.getUserOrFail();
      const { church } = await argsSchema.validate(args, {
        stripUnknown: true,
      });

      const existingchurchName = await findData(
        'church',
        'name',
        '==',
        church.name,
      );
      if (existingchurchName[0]) {
        throw NameTakenError.fromName(church.name);
      }
      const newId = uuid();
      try {
        await addData('church', { ...church, id: newId });
      } catch (e) {
        throw new churchInputError(e);
      }
      const result = await findData('church', 'id', '==', newId);
      if (!result[0]) {
        throw new churchInputError('sync error');
      }

      return result[0];
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
