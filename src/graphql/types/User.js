import { gql } from 'apollo-server';
import Event from '../../models/Event';
import * as yup from 'yup';

export const typeDefs = gql`
  type User {
    id: ID!
    createdAt: DateTime!
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    birthdate: DateTime
    state: Boolean!
    events: [Event]
    image: String
    rol: Int
  }
`;
export const resolvers = {
  User: {
    events: async ({ id }, args) => {
      return Event.query()
        .select('events.*')
        .innerJoin('detail', 'events.id', '=', 'detail.idEvent')
        .where('detail.idUser', '=', id);
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
