import { Kind } from 'graphql';
import ScalarType from '../types/ScalarType';

const DateScalar: ScalarType = {
  name: 'Date',
  description: 'Date scalar',
  parseValue: value => value,
  serialize: value => new Date(Number(value)),
  parseLiteral: ast => {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value);
    }
    return null;
  }
};

export default DateScalar;
