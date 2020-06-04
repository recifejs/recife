function Mutation(): any {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.value = {
      type: "Mutation",
      result: descriptor.value()
    };
  };
}

export default Mutation;
