import * as ts from 'typescript';
import Log from '../../log';
import InputCompiler from '../InputCompiler';
import TypeCompiler from '../TypeCompiler';
import FieldTypeEnum from '../enum/FieldTypeEnum';
import PrimitiveType from '../PrimitiveType';

import ImportDeclaration from './ImportDeclaration';
import Type from './Type';
import Input from './Input';

import capitalize from '../../helpers/capitalize';
import createDecoratorOptions from '../../helpers/createDecoratorOptions';

class Field {
  public name!: string;
  public type!: string;
  public isRequired!: boolean;
  public visible: boolean = true;
  public importDeclaration?: ImportDeclaration;
  private node: ts.PropertyDeclaration | ts.PropertySignature;
  private sourceFile?: ts.SourceFile;
  private path: string;
  private parentName: string;

  constructor(
    node: ts.PropertyDeclaration | ts.PropertySignature,
    path: string,
    parentName: string,
    imports: ImportDeclaration[],
    fieldType: FieldTypeEnum,
    sourceFile?: ts.SourceFile
  ) {
    this.node = node;
    this.sourceFile = sourceFile;
    this.path = path;
    this.parentName = parentName;

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
      this.importDeclaration = imports.find(importDecl => importDecl.names.some(item => item.name === this.name));
      this.isRequired = !node.questionToken;

      if (ts.isUnionTypeNode(node.type)) {
        node.type.types.forEach(type => {
          if (type.kind === ts.SyntaxKind.UndefinedKeyword) {
            this.isRequired = false;
          } else {
            this.type = PrimitiveType.getPrimitiveType(type.getText(sourceFile));
          }
        });
      } else if (ts.isTypeLiteralNode(node.type)) {
        if (fieldType === FieldTypeEnum.INPUT) {
          const input = InputCompiler.Instance.compileObjectLiteral(
            node.type,
            `${capitalize(this.parentName)}${capitalize(this.name)}`,
            this.path
          );
          this.type = input.name;
        } else if (fieldType === FieldTypeEnum.TYPE) {
          const type = TypeCompiler.Instance.compileObjectLiteral(
            node.type,
            `${capitalize(this.parentName)}${capitalize(this.name)}`,
            this.path
          );
          this.type = type.name;
        }
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

  verifyAndUpdateType(scalars: string[], types: Type[], inputs: Input[]) {
    if (this.visible && !scalars.includes(this.type)) {
      const type = types.find(type => type.name === this.type);
      const input = inputs.find(input => input.name === this.type);

      if (!type && !input) {
        Log.Instance.error({
          code: 'type-unreferenced',
          message: `Type unreferenced in property ${this.name}`,
          path: this.path,
          node: this.node,
          sourceFile: this.sourceFile
        });
      } else {
        if (type && type.options.name) {
          this.type = type.options.name;
        }
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
