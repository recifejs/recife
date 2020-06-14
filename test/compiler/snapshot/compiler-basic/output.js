'use-strict';

const { gql } = require('apollo-server-koa');

module.exports = {
  types: gql`
    scalar Date

    type Input {
      id: Float
      name: String
    }

    input FilterUser {
      name: String
      type: String!
    }

    type Query {
      getUser(input: FilterUser!): Input
      allUsers(input: FilterUser): [Input]
    }
  `
};
