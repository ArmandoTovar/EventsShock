import { gql } from 'apollo-server';
import { merge } from 'lodash';
import Church from './types/Church';
import Section from './types/Section';
import sectionQuery from './queries/section';
import churchQuery from './queries/church';
import formsQuery from './queries/forms';
import groupQuery from './queries/groups';
import User from './types/User';
import createChurchMutation from './mutations/createChurch';
import createUserMutation from './mutations/createUser';
import editUserMutation from './mutations/editUser';
import editGroupMutation from './mutations/editGroup';

import authenticateMutation from './mutations/authenticate';
import usersQuery from './queries/users';
import meQuery from './queries/me';
import PageInfo from './types/PageInfo';

import OrderDirection from './enums/OrderDirection';
import createGroupMutation from './mutations/createGroup';
import Group from './types/Group';
import deleteGroupMutation from './mutations/deleteGroup';
import DateTime from './scalars/DateTime';

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
  Section.typeDefs,
  Church.typeDefs,
  createChurchMutation.typeDefs,
  churchQuery.typeDefs,
  sectionQuery.typeDefs,
  groupQuery.typeDefs,
  formsQuery.typeDefs,
  createUserMutation.typeDefs,
  editUserMutation.typeDefs,
  editGroupMutation.typeDefs,
  authenticateMutation.typeDefs,
  PageInfo.typeDefs,
  usersQuery.typeDefs,
  meQuery.typeDefs,
  OrderDirection.typeDefs,
  createGroupMutation.typeDefs,
  Group.typeDefs,
  deleteGroupMutation.typeDefs,
];

export const resolvers = merge(
  DateTime.resolvers,
  Section.resolvers,
  sectionQuery.resolvers,
  Church.resolvers,
  createChurchMutation.resolvers,
  groupQuery.resolvers,
  User.resolvers,
  formsQuery.resolvers,
  churchQuery.resolvers,
  createUserMutation.resolvers,
  authenticateMutation.resolvers,
  editUserMutation.resolvers,
  editGroupMutation.resolvers,
  usersQuery.resolvers,
  meQuery.resolvers,
  OrderDirection.resolvers,
  createGroupMutation.resolvers,
  Group.resolvers,
  deleteGroupMutation.resolvers,
  PageInfo.resolvers,
);
