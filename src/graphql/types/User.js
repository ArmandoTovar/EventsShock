import { gql } from 'apollo-server';
import * as yup from 'yup';
import { findData } from '../../firebase';

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    fullName: String!
    country: String!
    phone: String!
    distrite: String!
    church: String!
    mentorType: String!
    range: String!
    groups: [Group!]
    groupsCount: Int!
    membersCount: Int!
    createAt: DateTime!
  }
`;

export const resolvers = {
  User: {
    groupsCount: async (
      { id },
      args,
      { dataLoaders: { userGroupCountLoader } },
    ) => {
      return userGroupCountLoader.load(id);
    },
    membersCount: async (
      { id },
      args,
      { dataLoaders: { userMembersCountLoader } },
    ) => {
      return userMembersCountLoader.load(id);
    },
    groups: async ({ id }, args) => {
      const groups = await findData('group', 'userId', '==', id);
      return groups;
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
