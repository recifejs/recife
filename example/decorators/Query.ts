function Query(): any {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.value = {
      type: "Query",
      result: descriptor.value()
    };
  };
}

export default Query;
