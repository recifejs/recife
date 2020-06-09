/*
|------------|
|  RecifeJS  |
|------------|
*/

import { GraphqlConfig } from 'recife';

const graphqlConfig: GraphqlConfig = {
  playground: true,
  introspection: true,
  debug: true,
  mocks: false,
  mockEntireSchema: true,
  rootValue: null
};

export default graphqlConfig;
