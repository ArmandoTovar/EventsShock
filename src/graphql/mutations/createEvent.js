import { gql, ApolloError } from 'apollo-server';
import * as yup from 'yup';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import { createWriteStream } from 'fs';
import Event from '../../models/Event';

export const typeDefs = gql`
  input CreateEventInput {
    name: String!
    startDate: DateTime!
    finishDate: DateTime!
    image: String
  }

  extend type Mutation {
    createEvent(Event: CreateEventInput): Event
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
    name: yup.string().min(1).max(30).required('Event Name is required. '),
    startDate: yup.date().required('start Date is required. '),
    finishDate: yup.date().required('finish Date is required. '),
  }),
});

export const resolvers = {
  Mutation: {
    createEvent: async (obj, args, { authService }) => {
      const {
        Event: { name, image, ...event },
      } = await argsSchema.validate(args);

      //const { filename, mimetype, createReadStream } = image;
      const currentUser = await authService.getUserOrFail();

      if (currentUser.rol != 1) {
        throw new ForbiddenError('User is not authorized to delete the event');
      }

      const existingEvent = await Event.query().findOne({
        name,
      });

      if (existingEvent) {
        throw EventTakenError.fromName(name);
      }
      // const path = `../../imagenes/${image}`;
      // const stream = createReadStream();
      // await new Promise((resolve, reject) =>
      //   stream
      //     .pipe(createWriteStream(path))
      //     .on('finish', () => resolve({ image }))
      //     .on('error', reject),
      // );

      return Event.query().insertAndFetch({
        ...event,
        name,
        image: image,
        id: uuid(),
      });
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
