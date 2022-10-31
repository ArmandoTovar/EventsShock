import { gql, UserInputError } from 'apollo-server';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import { auth, findData } from '../../firebase';

export const typeDefs = gql`
  input AuthenticateInput {
    username: String!
    password: String!
  }

  type AuthenticatePayload {
    user: User!
    accessToken: String!
    expiresAt: DateTime!
  }

  extend type Mutation {
    """
    Generates a new access token, if provided credentials (username and password) match any registered user.
    """
    authenticate(credentials: AuthenticateInput): AuthenticatePayload
  }
`;

const argsSchema = yup.object().shape({
  credentials: yup.object().shape({
    username: yup.string().required().lowercase().trim(),
    password: yup.string().required().trim(),
  }),
});

export const resolvers = {
  Mutation: {
    authenticate: async (obj, args, { authService }) => {
      const {
        credentials: { username, password },
      } = await argsSchema.validate(args, {
        stripUnknown: true,
      });

      const userDataLogin = await auth(username, password);

      if (!userDataLogin) {
        throw new UserInputError('Invalid username or password');
      }
      const {
        email,
        stsTokenManager: { accessToken, expirationTime },
      } = userDataLogin;

      const userData = await findData('user', 'username', '==', email);
      const user = userData[0];
      if (!user) {
        throw new UserInputError('Username doesn’t exist ');
      }

      return {
        user,
        // accessToken,
        // expiresAt: { seconds: expirationTime },
        ...authService.createAccessToken(user.id),
      };
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
