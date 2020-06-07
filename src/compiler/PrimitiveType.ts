class PrimitiveType {
  static getPrimitiveType(type: string = 'string'): string {
    const isArray = PrimitiveType.isArray(type);
    type = PrimitiveType.formatType(type);

    switch (type.toLowerCase()) {
      case 'number':
        type = 'Float';
      case 'boolean':
        type = 'Boolean';
      case 'string':
        type = 'String';
    }

    return isArray ? `[${type}]` : type;
  }

  static formatType(type: string): string {
    return type.replace(/\[|\]|Array\<|\>]/g, '').replace('Model', '');
  }

  static isArray(type: string): boolean {
    if (type.includes('[]')) {
      return true;
    }
    if (type.includes('Array<')) {
      return true;
    }

    return false;
  }
}

export default PrimitiveType;
