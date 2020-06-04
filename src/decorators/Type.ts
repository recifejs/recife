function Type(): any {
  return function(
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.value = {
      type: "Type",
      result: descriptor.value
    };
  };
}

export default Type;
