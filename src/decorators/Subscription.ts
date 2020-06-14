import GraphOptionsType from '../types/GraphOptionsType';

function Subscription(options: GraphOptionsType = {}): any {
  return function(_target: any, _propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    const originalMethod = descriptor.value;
    descriptor.value = function() {
      return originalMethod.apply(this, arguments);
    };

    return descriptor;
  };
}

export default Subscription;
