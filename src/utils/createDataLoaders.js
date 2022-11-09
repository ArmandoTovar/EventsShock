// import DataLoader from 'dataloader';
import { camelCase, isArray, find, zipObject } from 'lodash';

import DataLoader from 'dataloader';
import User from '../models/User';
import Event from '../models/Event';
const jsonCacheKeyFn = (value) => JSON.stringify(value);

const createModelLoader = (Model) =>
  new DataLoader(
    async (ids) => {
      const idColumns = isArray(Model.idColumn)
        ? Model.idColumn
        : [Model.idColumn];

      const camelCasedIdColumns = idColumns.map((id) => camelCase(id));

      const results = await Model.query().findByIds(ids);
      return ids.map(
        (id) =>
          find(
            results,
            zipObject(camelCasedIdColumns, isArray(id) ? id : [id]),
          ) || null,
      );
    },
    {
      cacheKeyFn: jsonCacheKeyFn,
    },
  );

export const createDataLoaders = () => {
  return {
    userLoader: createModelLoader(User),
    eventLoader: createModelLoader(Event),
  };
};

export default createDataLoaders;
