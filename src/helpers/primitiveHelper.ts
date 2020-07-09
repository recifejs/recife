import * as ts from 'typescript';

export const formatPrimitiveString = (type: string = 'string'): string => {
  type = type.replace(/Model/g, '');

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

  return type;
};

export const formatPrimitive = (type: ts.Node): string => {
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
};
