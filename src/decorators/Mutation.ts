import GraphOptionsType from '../types/GraphOptionsType';

function Mutation(options: GraphOptionsType = {}): any {
  return function(_target: Object, _propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    const originalMethod = descriptor.value;
    descriptor.value = function() {
      return originalMethod.apply(this, arguments);
    };

    return descriptor;
  };
}

export default Mutation;
