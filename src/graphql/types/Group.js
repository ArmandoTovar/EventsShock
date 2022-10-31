import { gql, UserInputError } from 'apollo-server';

import { findData } from '../../firebase';

export const typeDefs = gql`
  type Group {
    id: ID!
    userId: String!
    createAt: DateTime!
    etareaGroup: String!
    groupName: String!
    description: String
    church: String!
    initialDate: DateTime
    finishDate: DateTime
    members: [User!]
    ministry: String!
    language: String!
    modality: String!
    sections: [Section!]
    sectionCount: Int!
    progress: Int!
    format: String!
    subformat: String
  }
`;

export const resolvers = {
  Group: {
    members: async ({ members }, args) => {
      if (!members) return null;
      const uniqueMembers = [...new Set(members)];
      const users = await Promise.all(
        uniqueMembers.map(async (memberId) => {
          const user = await findData('user', 'id', '==', memberId);
          if (!user[0]) {
            throw new UserInputError(
              `user member id:${memberId} does not exist `,
            );
          }
          return user[0];
        }),
      );
      return users.length === 0 ? null : users;
    },
    sections: async ({ id }, ...args) => {
      if (!id) return null;
      const sections = await findData('section', 'parent', '==', id);
      return sections.length === 0 ? null : sections;
    },
    sectionCount: (
      { id },
      args,
      { dataLoaders: { groupSectionCountLoader } },
    ) => groupSectionCountLoader.load(id),
    initialDate: ({ id }, args, { dataLoaders: { groupInitialDateLoader } }) =>
      groupInitialDateLoader.load(id),
    finishDate: ({ id }, args, { dataLoaders: { groupFinishDateLoader } }) =>
      groupFinishDateLoader.load(id),
    progress: ({ id }, args, { dataLoaders: { groupProgressLoader } }) =>
      groupProgressLoader.load(id),
  },
};

export default {
  typeDefs,
  resolvers,
};
