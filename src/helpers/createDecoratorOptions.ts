import * as ts from 'typescript';

const createDecoratorOptions = (expression: ts.ObjectLiteralExpression, sourceFile?: ts.SourceFile): any => {
  let object: any = {};

  expression.properties.forEach(property => {
    if (ts.isPropertyAssignment(property)) {
      let value: any = property.initializer.getText(sourceFile).replace(/\"|\'/g, '');

      if (property.initializer.kind === ts.SyntaxKind.TrueKeyword.valueOf()) {
        value = true;
      } else if (property.initializer.kind === ts.SyntaxKind.NullKeyword.valueOf()) {
        value = null;
      } else if (property.initializer.kind === ts.SyntaxKind.UndefinedKeyword.valueOf()) {
        value = undefined;
      } else if (property.initializer.kind === ts.SyntaxKind.FalseKeyword.valueOf()) {
        value = false;
      }

      object[property.name.getText(sourceFile)] = value;
    }
  });

  return object;
};

export default createDecoratorOptions;
