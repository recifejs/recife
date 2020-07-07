import * as ts from 'typescript';

class PrimitiveType {
  static getPrimitiveType(type: string = 'string'): string {
    const isArray = PrimitiveType.isArray(type);
    type = PrimitiveType.formatType(type);

    switch (type.toLowerCase()) {
      case 'number':
        type = 'Float';
        break;
      case 'boolean':
        type = 'Boolean';
        break;
      case 'string':
        type = 'String';
        break;
    }

    return isArray ? `[${type}]` : type;
  }

  static readNode(type: ts.Node): string {
    switch (type.kind) {
      case ts.SyntaxKind.NumberKeyword:
        return 'Float';
      case ts.SyntaxKind.BooleanKeyword:
        return 'Boolean';
      case ts.SyntaxKind.StringKeyword:
        return 'String';
      default:
        return '';
    }
  }

  static formatType(type: string): string {
    return type.replace(/\[|\]|\>|Array\<|Model/g, '');
  }

  static isArray(type: string): boolean {
    if (type.includes('[') && type.includes(']')) {
      return true;
    }
    if (type.includes('Array<')) {
      return true;
    }

    return false;
  }
}

export default PrimitiveType;
