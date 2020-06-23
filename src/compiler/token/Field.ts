import * as ts from 'typescript';
import Log from '../../log';
import PrimitiveType from '../PrimitiveType';
import createDecoratorOptions from '../../helpers/createDecoratorOptions';

class Field {
  public name!: string;
  public type!: string;
  public isRequired!: boolean;
  public visible: boolean = true;

  constructor(node: ts.PropertyDeclaration | ts.PropertySignature, path: string, sourceFile?: ts.SourceFile) {
    if (node.type) {
      if (node.type.kind === ts.SyntaxKind.AnyKeyword) {
        Log.Instance.error({
          code: 'property-type-any',
          message: 'Property type can not any keyword',
          path,
          node: node,
          sourceFile
        });
      }

      this.name = node.name.getText(sourceFile);
      this.isRequired = !node.questionToken;

      if (ts.isUnionTypeNode(node.type)) {
        node.type.types.forEach(type => {
          if (type.kind === ts.SyntaxKind.UndefinedKeyword) {
            this.isRequired = false;
          } else {
            this.type = PrimitiveType.getPrimitiveType(type.getText(sourceFile));
          }
        });
      } else {
        this.type = PrimitiveType.getPrimitiveType(node.type.getText(sourceFile));
      }

      this.findTypeDecorator(node, sourceFile);
    } else {
      Log.Instance.error({
        code: 'type-not-exist',
        message: `Type not defined in property ${this.name}.`,
        path,
        node,
        sourceFile
      });
    }
  }

  private findTypeDecorator(nodeField: ts.PropertyDeclaration | ts.PropertySignature, sourceFile?: ts.SourceFile) {
    if (nodeField.decorators) {
      const decorator = nodeField.decorators.find(item => {
        if (item.getText(sourceFile).includes('Field')) {
          return item;
        }
      });

      if (decorator) {
        decorator.expression.forEachChild(expression => {
          if (ts.isStringLiteral(expression)) {
            this.type = expression.getText(sourceFile).replace(/\"|\'/g, '');
          } else if (ts.isObjectLiteralExpression(expression)) {
            const options = createDecoratorOptions(expression, sourceFile);

            if (options.type) {
              this.type = options.type;
            }

            if (options.visible === false) {
              this.visible = false;
            }
          }
        });
      }
    }
  }

  toStringType(): string {
    if (this.visible) {
      const required = this.isRequired ? '!' : '';
      return `  ${this.name}: ${this.type}${required} \n`;
    }

    return '';
  }
}

export default Field;
