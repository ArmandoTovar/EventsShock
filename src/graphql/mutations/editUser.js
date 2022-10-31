import { gql, UserInputError } from 'apollo-server';
import * as yup from 'yup';

import { editData, findData } from '../../firebase';

export const typeDefs = gql`
  input EditUserInput {
    church: String
    country: String
    distrite: String
    fullName: String
    mentorType: String
    phone: String
    range: String
  }

  extend type Mutation {
    editUser(user: EditUserInput): User
  }
`;

const argsSchema = yup.object().shape({
  user: yup.object().shape({
    fullName: yup.string().optional().min(3).max(30),
    church: yup.string().optional().min(3).max(30),
    country: yup.string().optional().min(3).max(30),
    distrite: yup.string().optional().min(3).max(30),
    mentorType: yup.string().optional().min(3).max(30),
    phone: yup.string().optional().min(3).max(30),
    range: yup.string().optional().min(3).max(30),
  }),
});

export const resolvers = {
  Mutation: {
    editUser: async (obj, args, { authService }) => {
      const currentUser = await authService.getUserOrFail();

      const { user } = await argsSchema.validate(args, {
        stripUnknown: true,
      });

      const oldUser = await findData('user', 'id', '==', currentUser.id);

      if (!oldUser[0]) {
        throw new UserInputError(
          `DataUser with id ${currentUser.id} does not exist`,
        );
      }

      await editData(currentUser.id, 'user', user);

      const result = await findData('user', 'id', '==', currentUser.id);
      if (!result[0]) {
        throw new UserInputError('sync error');
      }

      return result[0];
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
