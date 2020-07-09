import * as ts from 'typescript';
import Log from '../../log';
import InputCompiler from '../InputCompiler';
import TypeCompiler from '../TypeCompiler';
import FieldTypeEnum from '../enum/FieldTypeEnum';

import ImportDeclaration from './ImportDeclaration';
import Type from './Type';
import Input from './Input';

import capitalize from '../../helpers/capitalize';
import createDecoratorOptions from '../../helpers/createDecoratorOptions';
import { formatPrimitive, formatPrimitiveString } from '../../helpers/primitiveHelper';

class Field {
  public name!: string;
  public type!: string;
  public isRequired: boolean;
  public isArray: boolean;
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
    this.isRequired = false;
    this.isArray = false;

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

      this.readType(node.type, fieldType);
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

  private readType(type: ts.Node, fieldType: FieldTypeEnum) {
    if (ts.isUnionTypeNode(type)) {
      type.types.forEach(typeSingle => {
        if (typeSingle.kind === ts.SyntaxKind.UndefinedKeyword) {
          this.isRequired = false;
        } else {
          this.readType(typeSingle, fieldType);
        }
      });
    } else if (ts.isArrayTypeNode(type)) {
      this.isArray = true;
      if (ts.isTypeReferenceNode(type.elementType)) {
        this.readType(type.elementType, fieldType);
      }
    } else if (ts.isTypeReferenceNode(type)) {
      if (type.typeArguments && type.typeName.getText(this.sourceFile) === 'Array') {
        this.isArray = true;
        this.readType(type.typeArguments[0], fieldType);
      } else {
        this.type = formatPrimitiveString(type.typeName.getText(this.sourceFile));
      }
    } else if (ts.isTypeLiteralNode(type)) {
      switch (fieldType) {
        case FieldTypeEnum.INPUT:
          const input = InputCompiler.Instance.compileObjectLiteral(
            type,
            `${capitalize(this.parentName)}${capitalize(this.name)}`,
            this.path,
            this.sourceFile
          );
          this.type = input.name;
          break;
        case FieldTypeEnum.TYPE:
          const typeSchema = TypeCompiler.Instance.compileObjectLiteral(
            type,
            `${capitalize(this.parentName)}${capitalize(this.name)}`,
            this.path
          );
          this.type = typeSchema.name;
          break;
      }
    } else {
      this.type = formatPrimitive(type);
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
      let typeName = this.isArray ? `[${this.type}]` : this.type;
      typeName = `${typeName}${this.isRequired ? '!' : ''}`;

      return `  ${this.name}: ${typeName} \n`;
    }

    return '';
  }
}

export default Field;
