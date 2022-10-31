import { gql } from 'apollo-server';
import * as yup from 'yup';
import { findAll, findData, findFieldForm } from '../../firebase';
export const typeDefs = gql`
  type Form {
    etareaGroup: [String!]
    modality: [String!]
    format: [String!]
    subformat: [String!]
    ministry: [String!]
    language: [String!]
    country: [String!]
    province: [String!]
    distrite: [String!]
  }
  type Form2 {
    country: [String!]
    distrite: [String!]
    range: [String!]
    mentorType: [String!]
  }

  extend type Query {
    form: Form
    register: Form2
  }
`;

export const resolvers = {
  Query: {
    form: async () => {
      return {
        etareaGroup: async () => await findFieldForm('cg1'),
        modality: async () => await findFieldForm('cg2'),
        format: async () => await findFieldForm('cg3.1'),
        subformat: async () => await findFieldForm('cg3.2'),
        ministry: async () => await findFieldForm('cg4'),
        language: async () => await findFieldForm('cg5'),
        country: async () => await findFieldForm('cu1'),
        distrite: async () => await findFieldForm('cu2'),
        province: async () => await findFieldForm('cu3'),
      };
    },
    register: async () => {
      return {
        country: async () => await findFieldForm('cu1'),
        distrite: async () => await findFieldForm('cu2'),
        range: async () => await findFieldForm('cu4'),
        mentorType: async () => await findFieldForm('cu5'),
      };
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
