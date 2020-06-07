import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

class DateScalar extends GraphQLScalarType {
  constructor() {
    super({
      name: 'Date',
      description: 'Date scalar',
      parseValue(value) {
        return value;
      },
      serialize(value) {
        return new Date(Number(value));
      },
      parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
          return new Date(ast.value);
        }
        return null;
      }
    });
  }
}

export default DateScalar;
