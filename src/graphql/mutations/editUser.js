import {
  ApolloError,
  gql,
  ForbiddenError,
  UserInputError,
} from 'apollo-server';
import * as yup from 'yup';
import User from '../../models/User';
import { merge } from 'lodash';
import Detail from '../../models/Detail';
import { v4 as uuid } from 'uuid';
import Event from '../../models/Event';
export const typeDefs = gql`
  input EditUserInput {
    email: String
    password: String
    firstName: String
    lastName: String
    birthdate: DateTime
    events: [String]
    state: Boolean
    rol: Int
  }

  extend type Mutation {
    editUser(id: ID!, user: EditUserInput): User
  }
`;

class EmailTakenError extends ApolloError {
  constructor(message, properties) {
    super(message, 'EMAIL_TAKEN', properties);
  }

  static fromEmail(email) {
    return new EmailTakenError(
      `Email ${email} is already taken. Choose another Email`,
      { email },
    );
  }
}

const argsSchema = yup.object().shape({
  user: yup.object().shape({
    email: yup
      .string('You entered an invalid email address')
      .email()
      .min(1)
      .max(30)
      .lowercase()
      .trim(),
    password: yup
      .string()
      .optional()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
      ),
    firstName: yup.string().min(1).max(30).optional('First Name is required. '),
    lastName: yup.string().min(1).max(30).optional('Last Name is required. '),
  }),
});

export const resolvers = {
  Mutation: {
    editUser: async (obj, args, { authService }) => {
      const {
        user: { password, email, state, events, ...user },
      } = await argsSchema.validate(args);
      const currentUser = await authService.getUserOrFail();

      const targetUser = await User.query().findById(args.id);
      if (currentUser.rol != 1 && targetUser.id !== currentUser.id) {
        throw new ForbiddenError('User is not authorized to edit');
      }
      if (state !== undefined) {
        if (currentUser.rol != 1) throw new ForbiddenError('only ADM');
        merge(user, { state });
      }

      if (password) {
        const passwordHash = await createPasswordHash(password);
        merge(user, { password: passwordHash });
      }
      if (email) {
        const existingUser = await User.query().findOne({
          email,
        });

        if (existingUser) {
          throw EmailTakenError.fromEmail(email);
        }
        user.merge(user, { email });
      }
      if (events) {
        if (events.length === 0) {
          await Detail.query().where('idUser', '=', args.id).delete();

          return null;
        }
        const existingEvent = await Event.query().findByIds(events);

        if (events.length != existingEvent.length) {
          throw new UserInputError('event type does not exist');
        }
        await Detail.query().where('idUser', '=', args.id).delete();

        const newDetail = await Detail.query().insertAndFetch(
          events.map((e) => {
            return { idEvent: e, idUser: args.id, id: uuid() };
          }),
        );
        if (!newDetail[0].id) {
          throw DbSaveError.SaveError('save error');
        }
      }

      if (user !== {}) {
        const updateUser = await targetUser.$query().patchAndFetch({
          ...user,
        });
        return updateUser;
      } else {
        return targetUser;
      }
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
