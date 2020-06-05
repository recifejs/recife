function Mutation(): any {
  return function(
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.value = {
      type: 'Mutation',
      result: descriptor.value
    };
  };
}

export default Mutation;
