import { gql, UserInputError } from 'apollo-server';
import * as yup from 'yup';
import { find } from 'lodash';
import {
  addDatarunTransaction,
  editData,
  editDatarunTransaction,
  findData,
  removeData,
} from '../../firebase';
import { ChangeUserNameById } from './createGroup';
import { v4 as uuid } from 'uuid';
export const typeDefs = gql`
  input InputSectionEdit {
    id: String
    activeMembers: [String!]
    initialDate: DateTime
    state: Int
  }
  input EditGroupInput {
    etareaGroup: String
    groupName: String
    description: String
    church: String
    initialDate: DateTime
    members: [String!]
    language: String
    ministry: String
    sections: [InputSectionEdit!]
    modality: String
    format: String
    subformat: String
  }

  extend type Mutation {
    editGroup(
      group: EditGroupInput
      groupId: String!
      deleteSectionMissing: Boolean!
    ): Group
  }
`;

const argsSchema = yup.object().shape({
  group: yup.object().shape({
    etareaGroup: yup.string().optional(),
    groupName: yup.string().optional(),
    description: yup.string().optional().max(2000).trim(),
    church: yup.string().optional(),
    sections: yup
      .array()
      .optional()
      .of(
        yup
          .object()
          .optional()
          .shape({
            id: yup.string().optional(),
            activeMembers: yup
              .array()
              .optional()
              .of(yup.string().lowercase().trim()),
            initialDate: yup.date().optional(),
            state: yup.number().optional(),
          }),
      ),
    members: yup.array().optional().of(yup.string().lowercase().trim()),
    initialDate: yup.date().optional(),
    ministry: yup.string().optional(),
    modality: yup.string().optional(),
    language: yup.string().optional(),
    format: yup.string().optional(),
    subformat: yup.string().optional(),
  }),
});

export const resolvers = {
  Mutation: {
    editGroup: async (obj, args, { authService }) => {
      const currentUser = await authService.getUserOrFail();
      const { groupId, deleteSectionMissing, ...argsG } = args;

      const { group: groupData } = await argsSchema.validate(argsG, {
        stripUnknown: true,
      });
      const { groupName, sections, members, ...moreData } = groupData;
      const oldUser = await findData('user', 'id', '==', currentUser.id);

      if (!oldUser[0]) {
        throw new UserInputError(
          `DataUser with id ${currentUser.id} does not exist`,
        );
      }

      const group = await findData('group', 'id', '==', groupId);
      if (!group[0]) {
        throw new UserInputError(`Group with id ${groupId} does not exist`);
      }

      if (group[0].userId !== currentUser.id) {
        throw new ForbiddenError('User is not authorized to modify the group');
      }
      let groupNameOptional = {};
      if (groupName) {
        const existingGroup = await findData(
          'group',
          'userId',
          '==',
          currentUser.id,
        );
        if (find(existingGroup, { groupName: groupName })) {
          throw new UserInputError(`group name is in use`);
        }
        groupNameOptional = { groupName: groupName };
      }

      /// PARA LOS MODIFICAR LOS MIEMBROS
      let membersOptional = {};
      if (members) {
        membersOptional = { members: [] };
        if (members.length !== 0) {
          const allmembersId = new Set(members);
          if ([...allmembersId].length != members.length) {
            throw new UserInputError('Duplicated membersgroup');
          }
          const membersGroup = await findData('user', 'username', 'in', [
            ...allmembersId,
          ]);

          if (membersGroup.length !== members.length) {
            throw new UserInputError('Invalid membersgroup');
          }
          const change = ChangeUserNameById(membersGroup, members);
          membersOptional = {
            members: change,
          };
        }
        const existingSection = await findData(
          'section',
          'parent',
          '==',
          groupId,
        );
        const aus = existingSection.map(({ activeMembers, ...other }) => {
          const updateActiveMembers = activeMembers.filter((e) =>
            membersOptional.members.includes(e),
          );
          return { ...other, activeMembers: updateActiveMembers };
        });

        await editDatarunTransaction(['section'], { section: aus });
      }

      /// PARA MODIFICA LOS  MIEMBROS DE SECCIONES

      let updateSection = false;
      if (sections) {
        const existingSectionTemp = await findData(
          'section',
          'parent',
          '==',
          groupId,
        );
        const altSection = sections.filter((data) => data.hasOwnProperty('id'));
        if (deleteSectionMissing) {
          const secctionId = altSection.map(({ id }) => id);
          const deleteElemet = existingSectionTemp
            .filter((e) => !secctionId.includes(e.id))
            .map(({ id }) => removeData(id, 'section'));
          await Promise.all(deleteElemet);
          //
        }
        const newSection = sections.filter(
          (data) => !data.hasOwnProperty('id'),
        );
        if (newSection.length > 0) {
          const parseSections = newSection.map((e) => {
            return {
              state: 0,
              parent: groupId,
              activeMembers: [],
              id: uuid(),
              ...e,
            };
          });
          await addDatarunTransaction(['section'], {
            section: parseSections,
          });
          updateSection = true;
        }

        if (altSection.length > 0) {
          const existingSection = await findData(
            'section',
            'id',
            'in',
            altSection.map(({ id }) => id),
          );

          if (existingSection.length !== altSection.length) {
            throw new UserInputError(`Section with ids does not exist`);
          }

          const temp = [
            ...new Set(
              altSection
                .map(({ activeMembers }) =>
                  activeMembers ? activeMembers : null,
                )
                .flat(),
            ),
          ];

          let membersSeccion = [];
          if (temp[0] !== null && temp.length !== 0) {
            membersSeccion = await findData('user', 'username', 'in', temp);
          }

          const datasection = altSection.map(
            ({ activeMembers, id, ...extra }) => {
              let membersSectionOptional = {};

              if (activeMembers) {
                membersSectionOptional = { activeMembers: [] };

                if (activeMembers.length !== 0) {
                  if (membersSeccion.length === 0) {
                    throw new UserInputError('Invalid members seccion');
                  }
                  const allmembersId = new Set(activeMembers);

                  if ([...allmembersId].length != activeMembers.length) {
                    throw new UserInputError('Duplicated membersActive');
                  }

                  const thisActiveMembersUsername = ChangeUserNameById(
                    membersSeccion,
                    activeMembers,
                  );

                  if (
                    thisActiveMembersUsername.length !== activeMembers.length
                  ) {
                    throw new UserInputError('Invalid members seccion');
                  }
                  membersSectionOptional = {
                    activeMembers: [...thisActiveMembersUsername],
                  };
                }
              }
              const dataSectionToSend = {
                ...extra,
                ...membersSectionOptional,
              };

              if (Object.keys(dataSectionToSend).length !== 0) {
                return { ...dataSectionToSend, id };
              }
              return {};
            },
          );

          if (Object.keys(datasection[0]).length !== 0) {
            await editDatarunTransaction(['section'], { section: datasection });
            updateSection = true;
          }
        }
        // await editData(id, 'section', dataSectionToSend);
      }
      const dataToSend = {
        ...moreData,
        ...groupNameOptional,
        ...membersOptional,
      };
      if (Object.keys(dataToSend).length === 0 && !updateSection) {
        throw new UserInputError('missing parameter');
      }
      await editData(group[0].id, 'group', dataToSend);

      const result = await findData('group', 'id', '==', group[0].id);
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
