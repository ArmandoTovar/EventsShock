import { gql, ApolloError, UserInputError } from 'apollo-server';
import * as yup from 'yup';
import { addData, addDatarunTransaction, findData } from '../../firebase';
import { find, includes, uniqBy } from 'lodash';
import { v4 as uuid } from 'uuid';

export const typeDefs = gql`
  input InputSection {
    initialDate: DateTime!
  }
  input CreateGroupInput {
    etareaGroup: String!
    groupName: String!
    description: String
    church: String!
    members: [String!]
    language: String!
    ministry: String!
    sections: [InputSection!]
    modality: String!
    format: String!
    subformat: String
  }

  extend type Mutation {
    createGroup(group: CreateGroupInput): Group
  }
`;

class GroupAlreadyNameError extends ApolloError {
  constructor(message = 'User has already group with this name') {
    super(message, 'GROUP_ALREADY_NAME');
  }
}

export const ChangeUserNameById = (ref, data) => {
  return data.map((e) => find(ref, { username: e }).id);
};
const argsSchema = yup.object().shape({
  group: yup.object().shape({
    etareaGroup: yup.string().required(),
    groupName: yup.string().required(),
    description: yup.string().max(2000).trim(),
    church: yup.string().required(),
    sections: yup.array().of(
      yup.object().shape({
        initialDate: yup.date().required(),
      }),
    ),
    members: yup.array().of(yup.string().optional()).required(),
    ministry: yup.string().required(),
    modality: yup.string().required(),
    language: yup.string().required(),
    format: yup.string().required(),
    subformat: yup.string(),
  }),
});

export const resolvers = {
  Mutation: {
    createGroup: async (obj, args, { authService }) => {
      const currentUser = await authService.getUserOrFail();

      const { group } = await argsSchema.validate(args, {
        stripUnknown: true,
      });
      const { members, groupName, sections, ...newGroup } = group;
      const existingGroup = await findData(
        'group',
        'userId',
        '==',
        currentUser.id,
      );
      if (find(existingGroup, { groupName: groupName })) {
        throw new GroupAlreadyNameError();
      }
      let totalMember = [];
      const allmembersId = [...new Set(members.flat())];
      if (allmembersId.length !== 0) {
        const membersGroup = await findData(
          'user',
          'username',
          'in',
          allmembersId,
        );
        if (membersGroup.length !== allmembersId.length) {
          throw new UserInputError('Invalid membersgroup');
        }
        totalMember = [...new Set(ChangeUserNameById(membersGroup, members))];
      }

      if (
        uniqBy(sections, ({ initialDate }) => {
          return initialDate.getTime();
        }).length !== sections.length
      ) {
        throw new UserInputError('repeated start date');
      }

      const newId = uuid();
      const tempGroupData = {
        ...newGroup,
        userId: currentUser.id,
        groupName,
        members: totalMember,
        id: newId,
      };

      const parseSections = sections.map(({ initialDate }) => {
        return {
          initialDate,
          state: 0,
          parent: newId,
          activeMembers: [],
          id: uuid(),
        };
      });

      await addDatarunTransaction(['group', 'section'], {
        group: [tempGroupData],
        section: parseSections,
      });

      const result = await findData('group', 'id', '==', newId);
      if (!result[0]) {
        throw new UserInputError('sync error');
      }

      return result[0];
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
