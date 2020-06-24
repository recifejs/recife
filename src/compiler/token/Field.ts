import * as ts from 'typescript';
import Log from '../../log';
import ImportDeclaration from './ImportDeclaration';
import PrimitiveType from '../PrimitiveType';
import createDecoratorOptions from '../../helpers/createDecoratorOptions';
import Type from './Type';

class Field {
  public name!: string;
  public type!: string;
  public isRequired!: boolean;
  public visible: boolean = true;
  public importDeclaration?: ImportDeclaration;
  private node: ts.PropertyDeclaration | ts.PropertySignature;
  private sourceFile?: ts.SourceFile;
  private path: string;

  constructor(
    node: ts.PropertyDeclaration | ts.PropertySignature,
    path: string,
    imports: ImportDeclaration[],
    sourceFile?: ts.SourceFile
  ) {
    this.node = node;
    this.sourceFile = sourceFile;
    this.path = path;

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
      this.importDeclaration = imports.find(importDecl => importDecl.names.includes(this.name));
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

  verifyExistType(scalars: string[], types: Type[]) {
    if (this.visible && !scalars.includes(this.type)) {
      const existType = types.some(type => type.name === this.type || type.options.name === this.type);

      if (!existType) {
        Log.Instance.error({
          code: 'type-unreferenced',
          message: `Type unreferenced in property ${this.name}`,
          path: this.path,
          node: this.node,
          sourceFile: this.sourceFile
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
