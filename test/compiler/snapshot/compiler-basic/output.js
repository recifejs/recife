'use-strict';

const { gql } = require('apollo-server-koa');

module.exports = {
  types: gql`
    type Query
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

    extend type Query {
      getUser(input: FilterUser!): Input
    }

    extend type Query {
      allUsers(input: FilterUser): [Input]!
    }
  `
};
