import { gql } from 'apollo-server';
import { raw } from 'objection';
import * as yup from 'yup';

import Event from '../../models/Event';

export const typeDefs = gql`
  enum AlleventsOrderBy {
    CREATED_AT
    START_DATE
  }

  extend type Query {
    """
    Returns paginated events.
    """
    events(
      after: String
      first: Int
      orderDirection: OrderDirection
      orderBy: AlleventsOrderBy
      searchKeyword: String
      name: String
    ): EventConnection!
  }
`;

const argsSchema = yup.object({
  after: yup.string(),
  first: yup.number().min(1).max(30).default(30),
  orderDirection: yup.string().default('DESC'),
  orderBy: yup.string().default('CREATED_AT'),
  searchKeyword: yup.string().trim(),
  name: yup.string().trim(),
});

const orderColumnByOrderBy = {
  CREATED_AT: 'createdAt',
  START_DATE: 'startDate',
};

const getLikeFilter = (value) => `%${value}%`;

export const resolvers = {
  Query: {
    events: async (obj, args) => {
      const normalizedArgs = await argsSchema.validate(args);

      const { first, orderDirection, after, orderBy, searchKeyword, name } =
        normalizedArgs;

      const orderColumn = orderColumnByOrderBy[orderBy];

      let query = Event.query();

      if (name) {
        query = query.where({
          name,
        });
      } else if (searchKeyword) {
        const likeFilter = getLikeFilter(searchKeyword);

        query = query.where((qb) => {
          return qb.where('name', 'like', likeFilter);
        });
      }

      return query.cursorPaginate({
        first,
        after,
        orderBy: [
          { column: orderColumn, order: orderDirection.toLowerCase() },
          'id',
        ],
      });
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
