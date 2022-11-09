import { gql } from 'apollo-server';
import User from './types/User';
import UserConnection from './types/UserConnection';
import Event from './types/Event';
import EventConnection from './types/EventConnection';
import eventQuery from './queries/event';
import eventsQuery from './queries/events';
import createUserMutation from './mutations/createUser';
import editUserMutation from './mutations/editUser';
import editEventMutation from './mutations/editEvent';
import deleteUserMutation from './mutations/deleteUser';
import createEventMutation from './mutations/createEvent';
import deleteEventMutation from './mutations/deleteEvent';
import authenticateMutation from './mutations/authenticate';
import usersQuery from './queries/users';
import meQuery from './queries/me';
import PageInfo from './types/PageInfo';

import OrderDirection from './enums/OrderDirection';
import DateTime from './scalars/DateTime';
import { merge } from 'lodash';

const rootTypeDefs = gql`
  type Query {
    root: String
  }
  type Mutation {
    root: String
  }
`;

export const typeDefs = [
  rootTypeDefs,
  DateTime.typeDefs,
  User.typeDefs,
  UserConnection.typeDefs,
  Event.typeDefs,
  EventConnection.typeDefs,
  eventQuery.typeDefs,
  eventsQuery.typeDefs,
  createUserMutation.typeDefs,
  editUserMutation.typeDefs,
  deleteUserMutation.typeDefs,
  createEventMutation.typeDefs,
  deleteEventMutation.typeDefs,
  editEventMutation.typeDefs,
  authenticateMutation.typeDefs,
  PageInfo.typeDefs,
  meQuery.typeDefs,
  usersQuery.typeDefs,
  OrderDirection.typeDefs,
];

export const resolvers = merge(
  DateTime.resolvers,
  User.resolvers,
  UserConnection.resolvers,
  usersQuery.resolvers,
  createUserMutation.resolvers,
  editUserMutation.resolvers,
  deleteUserMutation.resolvers,
  createEventMutation.resolvers,
  editEventMutation.resolvers,
  deleteEventMutation.resolvers,
  Event.resolvers,
  EventConnection.resolvers,
  eventQuery.resolvers,
  eventsQuery.resolvers,
  authenticateMutation.resolvers,
  meQuery.resolvers,
  OrderDirection.resolvers,
  PageInfo.resolvers,
);
