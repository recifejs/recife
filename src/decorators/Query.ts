export type QueryOptionsType = {
  name?: string;
  middleware?: string[];
};

function Query(options: QueryOptionsType = {}): any {
  return function(_target: any, _propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    const originalMethod = descriptor.value;
    descriptor.value = function() {
      return originalMethod.apply(this, arguments);
    };

    return descriptor;
  };
}

export default Query;
