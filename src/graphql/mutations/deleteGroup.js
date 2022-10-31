import { gql, UserInputError, ForbiddenError } from 'apollo-server';
import { findData, removeConditionData, removeData } from '../../firebase';

export const typeDefs = gql`
  extend type Mutation {
    deleteGroup(id: ID!): Boolean
  }
`;

export const resolvers = {
  Mutation: {
    deleteGroup: async (obj, args, { authService }) => {
      const currentUser = await authService.getUserOrFail();

      const group = await findData('group', 'id', '==', args.id);
      // // if (!group[0]) {
      // //   throw new UserInputError(`Group with id ${args.id} does not exist`);
      // // }

      // // if (group[0].userId !== currentUser.id) {
      // //   throw new ForbiddenError('User is not authorized to delete the group');
      // // }

      await removeData(args.id, 'group');

      await removeConditionData('section', 'parent', '==', args.id);
      return true;
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
