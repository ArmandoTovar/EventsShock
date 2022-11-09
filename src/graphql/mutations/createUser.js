import { gql, ApolloError, UserInputError } from 'apollo-server';
import * as yup from 'yup';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';

import User from '../../models/User';
import Event from '../../models/Event';
import Detail from '../../models/Detail';
import knex from '../../utils/knex';

export const typeDefs = gql`
  input CreateUserInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    birthdate: DateTime
    image: String
  }

  extend type Mutation {
    createUser(user: CreateUserInput): User
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

class DbSaveError extends ApolloError {
  constructor(message, properties) {
    super(message, 'DB', properties);
  }

  static SaveError(e) {
    return new DbSaveError(`Db Error`, { e });
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
      .required()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
      ),
    firstName: yup.string().min(1).max(30).required('First Name is required. '),
    lastName: yup.string().min(1).max(30).required('Last Name is required. '),
    image: yup.string().nullable().min(10).optional(),
    birthdate: yup.date().optional(),
  }),
});

const createPasswordHash = (password) => bcrypt.hash(password, 10);

export const resolvers = {
  Mutation: {
    createUser: async (obj, args) => {
      const {
        user: { password, email, ...user },
      } = await argsSchema.validate(args, {
        stripUnknown: true,
      });

      const passwordHash = await createPasswordHash(password);
      const existingUser = await User.query().findOne({
        email: email,
      });

      if (existingUser) {
        throw EmailTakenError.fromEmail(email);
      }
      const newId = uuid();
      const transaction = await knex.transaction();
      try {
        const newUser = await User.query(transaction).insertAndFetch({
          ...user,
          email,
          rol: 0,
          password: passwordHash,
          id: newId,
        });

        await transaction.commit();
        return newUser;
      } catch (e) {
        await transaction.rollback();
        throw DbSaveError.SaveError(e);
      }
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
