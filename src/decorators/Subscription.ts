function Subscription(): any {
  return function(
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.value = {
      type: 'Subscription',
      result: descriptor.value
    };
  };
}

export default Subscription;
