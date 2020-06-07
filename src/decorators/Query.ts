function Query(): any {
  return function(_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value = {
      type: 'Query',
      result: descriptor.value
    };
  };
}

export default Query;
