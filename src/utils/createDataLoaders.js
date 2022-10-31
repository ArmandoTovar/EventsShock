// import DataLoader from 'dataloader';
import { camelCase, isArray, find, zipObject } from 'lodash';

import DataLoader from 'dataloader';
import { countData, findData } from '../firebase';

const jsonCacheKeyFn = (value) => JSON.stringify(value);

const createModelLoader = (Model, key = 'id') =>
  new DataLoader(
    async (ids) => {
      return ids.map(async (id) => {
        const results = await findData(Model, key, '==', id);
        return results[0];
      });
    },
    {
      cacheKeyFn: jsonCacheKeyFn,
    },
  );

const createUserGroupCountLoader = () =>
  new DataLoader(async (userIds) => {
    return userIds.map(async (id) => {
      const group = await countData('group', 'userId', '==', id);
      return group ? group : 0;
    });
  });
const createUserMembersCountLoader = () =>
  new DataLoader(async (userIds) => {
    return userIds.map(async (id) => {
      try {
        const group = await findData('group', 'userId', '==', id);
        const length = [...new Set(group.map(({ members }) => members).flat())]
          .length;
        return group ? length : 0;
      } catch (e) {
        return 0;
      }
    });
  });
const createGroupInitialDateLoader = () =>
  new DataLoader(async (groupId) => {
    return groupId.map(async (id) => {
      try {
        const section = await findData('section', 'parent', '==', id);
        const orderSection = section.sort(
          ({ initialDate: a }, { initialDate: b }) =>
            a.toDate() > b.toDate() ? 1 : a.toDate() < b.toDate() ? -1 : 0,
        );
        return orderSection ? orderSection[0].initialDate : null;
      } catch (e) {
        return null;
      }
    });
  });

const createGroupFinishDateLoader = () =>
  new DataLoader(async (groupId) => {
    return groupId.map(async (id) => {
      try {
        const section = await findData('section', 'parent', '==', id);
        const orderSection = section.sort(
          ({ initialDate: a }, { initialDate: b }) =>
            a.toDate() > b.toDate() ? -1 : a.toDate() < b.toDate() ? 1 : 0,
        );
        return orderSection ? orderSection[0].initialDate : null;
      } catch (e) {
        return null;
      }
    });
  });

const createGroupProgressLoader = () =>
  new DataLoader(async (groupId) => {
    return groupId.map(async (id) => {
      try {
        const section = await findData('section', 'parent', '==', id);

        const orderSection = section.filter(({ state }) => state === 2);
        if (orderSection.length === 0) return 0;
        return section
          ? Math.floor((orderSection.length * 100) / section.length)
          : 0;
      } catch (e) {
        return 0;
      }
    });
  });

const createGroupSectionCountLoader = () =>
  new DataLoader(async (groupId) => {
    return groupId.map(async (id) => {
      try {
        const section = await countData('section', 'parent', '==', id);
        return section ? section : 0;
      } catch (e) {
        return 0;
      }
    });
  });

export const createDataLoaders = () => {
  return {
    userLoader: createModelLoader('user'),
    sectionLoader: createModelLoader('section'),
    groupLoader: createModelLoader('group'),
    churchLoader: createModelLoader('church'),
    groupInitialDateLoader: createGroupInitialDateLoader(),
    groupFinishDateLoader: createGroupFinishDateLoader(),
    groupSectionCountLoader: createGroupSectionCountLoader(),
    groupProgressLoader: createGroupProgressLoader(),
    userMembersCountLoader: createUserMembersCountLoader(),
    userGroupCountLoader: createUserGroupCountLoader(),
  };
};

export default createDataLoaders;
