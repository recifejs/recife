import { PlaygroundConfig } from 'apollo-server-core';

type GraphqlConfig = {
  /*
   * Enables and disables playground and allows configuration of GraphQL Playground.
   */
  playground: PlaygroundConfig;
  /*
   * Enables and disables schema introspection.
   */
  introspection: boolean;
  /*
   * Enables and disables development mode helpers.
   */
  debug: boolean;
  /*
   * A boolean enabling the default mocks or object that contains definitions.
   */
  mocks: boolean;
  /*
   * A boolean controlling whether existing resolvers are overridden by mocks.
   */
  mockEntireSchema: boolean;
  /*
   * A value or function called with the parsed Document, creating the root value passed to the graphql executor.
   */
  rootValue: any;
};

export default GraphqlConfig;
