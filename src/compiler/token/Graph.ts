import * as ts from 'typescript';

import GraphParam from './GraphParam';
import Type from './Type';
import GraphTypeEnum from '../enum/GraphTypeEnum';
import SchemaOptions from '../../types/SchemaOptions';
import Log from '../../log';

import createDecoratorOptions from '../../helpers/createDecoratorOptions';
import { isExportDefault } from '../../helpers/exportHelper';
import { formatPrimitive, formatPrimitiveString } from '../../helpers/primitiveHelper';

class Graph {
  public name!: string;
  public type!: GraphTypeEnum;
  public params!: GraphParam;
  public isExportDefaultController: boolean;
  public return: {
    type?: string;
    isRequired: boolean;
    isArray: boolean;
  };
  public nameController: string;
  public path: string;
  public options: SchemaOptions;
  private node: ts.MethodDeclaration;
  private sourceFile?: ts.SourceFile;

  constructor(
    method: ts.MethodDeclaration,
    classDecl: ts.ClassDeclaration,
    path: string,
    isDefaultExternal: boolean,
    sourceFile?: ts.SourceFile
  ) {
    this.node = method;
    this.sourceFile = sourceFile;
    this.nameController = classDecl.name!.getText(sourceFile);
    this.path = path;
    this.options = {};
    this.name = method.name.getText(sourceFile);
    this.isExportDefaultController = isDefaultExternal || isExportDefault(classDecl);
    this.return = { isRequired: true, isArray: false };

    if (method.type) {
      if (method.type.kind === ts.SyntaxKind.AnyKeyword) {
        Log.Instance.error({
          code: 'return-type-any',
          message: 'Return type can not any keyword',
          path: this.path,
          node: method,
          sourceFile
        });
      }

      this.readReturn(method.type, sourceFile);
    } else {
      Log.Instance.error({
        code: 'return-not-exist',
        message: `Return not defined in method ${this.name}.`,
        path: this.path,
        node: method,
        sourceFile
      });
    }

    if (method.decorators) {
      method.decorators.forEach((decorator: ts.Decorator) => {
        decorator.expression.forEachChild((expression: ts.Node) => {
          if (ts.isIdentifier(expression)) {
            switch (expression.getText(sourceFile)) {
              case 'Query':
                this.type = GraphTypeEnum.QUERY;
                break;
              case 'Mutation':
                this.type = GraphTypeEnum.MUTATION;
                break;
              case 'Subscription':
                this.type = GraphTypeEnum.SUBSCRIPTION;
                break;
            }
          } else if (ts.isObjectLiteralExpression(expression)) {
            this.options = { ...createDecoratorOptions(expression, sourceFile) };
          }
        });
      });
    }

    if (method.parameters[0] && GraphParam.isParamValid(method.parameters[0], sourceFile)) {
      this.params = new GraphParam(method.parameters[0], this.path, this.getName(), sourceFile);
    }
  }

  getName(): string {
    return this.options.name || this.name;
  }

  private readReturn(type: ts.Node, sourceFile?: ts.SourceFile) {
    if (ts.isUnionTypeNode(type)) {
      type.types.forEach(returnType => {
        if (returnType.kind === ts.SyntaxKind.UndefinedKeyword || returnType.kind === ts.SyntaxKind.NullKeyword) {
          this.return.isRequired = false;
        } else {
          this.readReturn(returnType, sourceFile);
        }
      });
    } else if (ts.isArrayTypeNode(type)) {
      this.return.isArray = true;
      if (ts.isTypeReferenceNode(type.elementType)) {
        this.readReturn(type.elementType, sourceFile);
      }
    } else if (ts.isTypeReferenceNode(type)) {
      if (type.typeArguments) {
        if (type.typeName.getText(sourceFile) === 'Array') {
          this.return.isArray = true;
        }
        this.readReturn(type.typeArguments[0], sourceFile);
      } else {
        this.return.type = formatPrimitiveString(type.typeName.getText(sourceFile));
      }
    } else {
      this.return.type = formatPrimitive(type);
    }
  }

  verifyAndUpdateType(scalars: string[], types: Type[]) {
    if (this.return.type) {
      if (!scalars.includes(this.return.type)) {
        const type = types.find(type => type.name === this.return.type);

        if (!type) {
          Log.Instance.error({
            code: 'type-unreferenced-method',
            message: `Type unreferenced in method ${this.name}`,
            path: this.path,
            node: this.node,
            sourceFile: this.sourceFile
          });
        } else {
          if (type.options.name) {
            this.return.type = type.options.name;
          }
        }
      }
    }
  }

  toStringType(): string {
    let typeString = '';
    const name = this.options.name || this.name;
    let returnName = this.return.isArray ? `[${this.return.type}]` : this.return.type;
    returnName = `${returnName}${this.return.isRequired ? '!' : ''}`;

    if (this.params) {
      const required = this.params.isRequired ? '!' : '';
      typeString += `  ${name}(${this.params.name}: ${this.params.type}${required}): ${returnName}\n`;
    } else {
      typeString += `  ${name}: ${returnName}\n`;
    }

    return `extend type ${this.type.toString()} {\n${typeString}}\n`;
  }
}

export default Graph;
