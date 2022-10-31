import { gql, ApolloError, UserInputError } from 'apollo-server';
import * as yup from 'yup';

import bcrypt from 'bcrypt';
import { addData, findData, signUp } from '../../firebase';
import { v4 as uuid } from 'uuid';
export const typeDefs = gql`
  type CreateUser {
    user: User!
    accessToken: String!
    expiresAt: DateTime!
  }
  input CreateUserInput {
    username: String!
    password: String!
    church: String!
    country: String!
    distrite: String!
    fullName: String!
    mentorType: String!
    phone: String!
    range: String!
  }

  extend type Mutation {
    createUser(user: CreateUserInput): CreateUser
  }
`;

class UsernameTakenError extends ApolloError {
  constructor(message, properties) {
    super(message, 'USERNAME_TAKEN', properties);
  }

  static fromUsername(username) {
    return new UsernameTakenError(
      `Username ${username} is already taken. Choose another username`,
      { username },
    );
  }
}

const argsSchema = yup.object().shape({
  user: yup.object().shape({
    username: yup.string().min(1).max(30).lowercase().trim(),
    password: yup.string().required(),
    // .matches(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
    //   'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
    // )
    fullName: yup.string('').min(3).max(30).required(),
    church: yup.string().min(3).max(30),
    country: yup.string().min(3).max(30),
    distrite: yup.string().min(3).max(30),
    fullName: yup.string().min(3).max(30),
    mentorType: yup.string().min(3).max(30),
    phone: yup.string().min(3).max(30),
    range: yup.string().min(3).max(30),
  }),
});

export const resolvers = {
  Mutation: {
    createUser: async (obj, args, { authService }) => {
      const {
        user: { username, password, ...user },
      } = await argsSchema.validate(args, {
        stripUnknown: true,
      });

      const existingUserName = await findData(
        'user',
        'username',
        '==',
        username,
      );
      if (existingUserName[0]) {
        throw UsernameTakenError.fromUsername(username);
      }
      const newId = uuid();
      try {
        const dataUser = await signUp(username, password);

        await addData('user', { ...user, username, id: newId });
      } catch (e) {
        throw new UserInputError(e);
      }
      const result = await findData('user', 'id', '==', newId);
      if (!result[0]) {
        throw new UserInputError('sync error');
      }

      return { ...result[0], ...authService.createAccessToken(newId) };
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
