import { gql, UserInputError, ForbiddenError } from 'apollo-server';

import Event from '../../models/Event';

export const typeDefs = gql`
  extend type Mutation {
    deleteEvent(id: ID!): Boolean
  }
`;

export const resolvers = {
  Mutation: {
    deleteEvent: async (obj, args, { authService }) => {
      const currentEvent = await authService.getUserOrFail();

      const event = await Event.query().findById(args.id);

      if (!event) {
        throw new UserInputError(`user with id ${args.id} does not exist`);
      }

      if (currentEvent.rol != 1) {
        throw new ForbiddenError('User is not authorized to delete the Event');
      }

      await Event.query().findById(args.id).delete();

      return true;
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
