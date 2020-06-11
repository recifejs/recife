import { GraphQLScalarSerializer, GraphQLScalarValueParser, GraphQLScalarLiteralParser } from 'graphql';

type ScalarType = {
  name: string;
  description?: string;
  serialize: GraphQLScalarSerializer<any>;
  parseValue: GraphQLScalarValueParser<any>;
  parseLiteral: GraphQLScalarLiteralParser<any>;
};

export default ScalarType;
