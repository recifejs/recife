class PrimitiveType {
  static getPrimitiveType(type: string = 'string'): string {
    switch (type) {
      case 'number':
        return 'Float';
      case 'boolean':
        return 'Boolean';
      case 'string':
        return 'String';
      default:
        return type.replace('Model', '');
    }
  }
}

export default PrimitiveType;
