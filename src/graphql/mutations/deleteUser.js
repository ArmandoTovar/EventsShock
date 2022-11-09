import { gql, UserInputError, ForbiddenError } from 'apollo-server';

import User from '../../models/User';

export const typeDefs = gql`
  extend type Mutation {
    deleteUser(id: ID!): Boolean
  }
`;

export const resolvers = {
  Mutation: {
    deleteUser: async (obj, args, { authService }) => {
      const currentUser = await authService.getUserOrFail();

      const user = await User.query().findById(args.id);

      if (!user) {
        throw new UserInputError(`user with id ${args.id} does not exist`);
      }

      if (currentUser.rol != 1) {
        throw new ForbiddenError('User is not authorized to delete the user');
      }

      await User.query().findById(args.id).delete();

      return true;
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
