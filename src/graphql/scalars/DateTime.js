import { GraphQLScalarType, Kind } from 'graphql';
import { gql } from 'apollo-server';
import { isValid, isDate } from 'date-fns';

const isValidDateTime = (value) => {
  const isSerializable =
    isDate(value) || typeof value === 'string' || typeof value === 'number';

  return isSerializable ? isValid(new Date(value)) : false;
};

const config = {
  name: 'DateTime',
  description:
    'A date-time string at UTC, such as 2007-12-03T10:15:30Z, ' +
    'compliant with the `date-time` format outlined in section 5.6 of ' +
    'the RFC 3339 profile of the ISO 8601 standard for representation ' +
    'of dates and times using the Gregorian calendar.',
  serialize(date) {
    const seconds = date.toDate();

    if (isValidDateTime(seconds)) {
      return new Date(seconds).toISOString();
    }

    throw new TypeError(
      `DateTime can not be serialized from ${JSON.stringify(seconds)}`,
    );
  },
  parseValue(seconds) {
    if (isValidDateTime(seconds)) {
      return new Date(seconds);
    }

    throw new TypeError(
      `DateTime can not be parsed from ${JSON.stringify(seconds)}`,
    );
  },
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new TypeError(
        `DateTime cannot represent non string type ${String(
          ast.seconds != null ? ast.seconds : null,
        )}`,
      );
    }

    const { value } = ast;

    if (isValidDateTime(value)) {
      return new Date(value);
    }

    throw new TypeError(
      `DateTime can not be parsed from ${JSON.stringify(value)}`,
    );
  },
};

export const resolvers = {
  DateTime: new GraphQLScalarType(config),
};

export const typeDefs = gql`
  scalar DateTime
`;

export default {
  resolvers,
  typeDefs,
};
