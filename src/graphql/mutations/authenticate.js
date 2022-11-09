import { gql, UserInputError } from 'apollo-server';
import * as yup from 'yup';
import bcrypt from 'bcrypt';

import User from '../../models/User';

export const typeDefs = gql`
  input AuthenticateInput {
    email: String!
    password: String!
  }

  type AuthenticatePayload {
    user: User!
    accessToken: String!
    expiresAt: DateTime!
  }

  extend type Mutation {
    authenticate(credentials: AuthenticateInput): AuthenticatePayload
  }
`;

const argsSchema = yup.object().shape({
  credentials: yup.object().shape({
    email: yup.string().required().lowercase().trim(),
    password: yup.string().required().trim(),
  }),
});

export const resolvers = {
  Mutation: {
    authenticate: async (obj, args, { authService }) => {
      const {
        credentials: { email, password },
      } = await argsSchema.validate(args, {
        stripUnknown: true,
      });

      const user = await User.query().findOne({ email });

      if (!user) {
        throw new UserInputError('Invalid email or password');
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        throw new UserInputError('Invalid email or password');
      }
      if (!user.state) {
        throw new UserInputError('You have been banned ');
      }
      return {
        user,
        ...authService.createAccessToken(user.id),
      };
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
