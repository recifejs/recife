import { Kind, GraphQLError } from 'graphql';
import { ScalarType } from '../../../../src';

function convertNull(value: string): string {
  return !value ? '' : value;
}

const UrlScalar: ScalarType = {
  name: 'Url',
  description: 'An Url Scalar',
  serialize: value => new URL(convertNull(value.toString())).toString(),
  parseValue: value => new URL(convertNull(value.toString())),
  parseLiteral: ast => {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(`This "${ast}" is not a string`);
    }

    return new URL(convertNull(ast.value.toString()));
  }
};

export default UrlScalar;
