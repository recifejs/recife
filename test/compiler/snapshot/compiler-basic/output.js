'use-strict';

const { gql } = require('apollo-server-core');

module.exports = {
  types: gql`
    type Query
    type Mutation
    scalar Date
    scalar Url

    type Input {
      age: Float!
      id: Float
      name: String
    }

    input FilterUser {
      name: String
      type: String!
    }

    input CreateUserInput {
      name: String
      type: String!
    }

    extend type Query {
      getUser(input: FilterUser!): Input
    }

    extend type Query {
      allUsers(input: FilterUser): [Input]!
    }

    extend type Mutation {
      createUser(input: CreateUserInput!): Input!
    }

    extend type Query {
      recife: String!
    }
  `
};
