export type MutationOptionsType = {
  name?: string;
  middleware?: string[];
};

function Mutation(options: MutationOptionsType = {}): any {
  return function(_target: Object, _propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    const originalMethod = descriptor.value;
    descriptor.value = function() {
      return originalMethod.apply(this, arguments);
    };

    return descriptor;
  };
}

export default Mutation;
