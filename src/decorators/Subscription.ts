export type SubscriptionOptionsType = {
  name?: string;
  middleware?: string[];
};

function Subscription(options: SubscriptionOptionsType = {}): any {
  return function(_target: any, _propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    const originalMethod = descriptor.value;
    descriptor.value = function() {
      return originalMethod.apply(this, arguments);
    };

    return descriptor;
  };
}

export default Subscription;
