import SchemaOptions from '../types/SchemaOptions';

function Mutation(options: SchemaOptions = {}): any {
  return function(_target: Object, _propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    const originalMethod = descriptor.value;
    descriptor.value = function() {
      return originalMethod.apply(this, arguments);
    };

    return descriptor;
  };
}

export default Mutation;
