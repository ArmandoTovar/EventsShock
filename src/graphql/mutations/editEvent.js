import { ApolloError, gql, ForbiddenError } from 'apollo-server';
import * as yup from 'yup';
import Event from '../../models/Event';
import { merge } from 'lodash';

export const typeDefs = gql`
  input EditEventInput {
    name: String
    startDate: DateTime
    finishDate: DateTime
    image: String
  }

  extend type Mutation {
    editEvent(id: ID!, event: EditEventInput): Event
  }
`;

class EventTakenError extends ApolloError {
  constructor(message, properties) {
    super(message, 'NAME_TAKEN', properties);
  }

  static fromName(name) {
    return new EventTakenError(
      `Name ${name} is already taken. Choose another name`,
      { name },
    );
  }
}

const argsSchema = yup.object().shape({
  Event: yup.object().shape({
    name: yup.string().min(1).max(30).optional(),
    startDate: yup.date().optional(),
    finishDate: yup.date().optional(),
  }),
});

export const resolvers = {
  Mutation: {
    editEvent: async (obj, args, { authService }) => {
      const {
        id,
        event: { name, image, ...event },
      } = await argsSchema.validate(args);

      const currentUser = await authService.getUserOrFail();

      if (currentUser.rol != 1) {
        throw new ForbiddenError('User is not authorized to delete the event');
      }
      if (name) {
        const existingEvent = await Event.query().findOne({
          name,
        });

        if (existingEvent) {
          throw EventTakenError.fromName(name);
        }
      }
      const oldEvent = await Event.query().findById(id);
      const newEvent = merge({ name }, event, { image });
      return await oldEvent.$query().updateAndFetch(newEvent);
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
