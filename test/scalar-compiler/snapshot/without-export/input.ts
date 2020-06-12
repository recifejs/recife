import { Kind, GraphQLError } from 'graphql';
import { ScalarType } from '../../../../src';

const UrlScalar: ScalarType = {
  name: 'Url',
  description: 'An Url Scalar',
  serialize: value => new URL(value.toString()).toString(),
  parseValue: value => new URL(value.toString()),
  parseLiteral: ast => {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(`This "${ast}" is not a string`);
    }

    return new URL(ast.value.toString());
  }
};
