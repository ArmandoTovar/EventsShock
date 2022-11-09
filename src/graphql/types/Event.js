import { gql } from 'apollo-server';
import User from '../../models/User';
export const typeDefs = gql`
  type Event {
    id: ID!
    name: String!
    createdAt: DateTime!
    startDate: DateTime!
    finishDate: DateTime!
    userId: [User!]
    image: String
  }
`;

export const resolvers = {
  Event: {
    userId: async ({ id }, args) => {
      const userId = await User.query()
        .select('users.*')
        .innerJoin('detail', 'users.id', '=', 'detail.idUser')
        .where('detail.idEvent', '=', id);

      return userId;
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
