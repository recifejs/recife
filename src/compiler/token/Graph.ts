import * as ts from 'typescript';
import GraphParam from './GraphParam';
import GraphTypeEnum from '../enum/GraphTypeEnum';
import PrimitiveType from '../PrimitiveType';
import SchemaOptions from '../../types/SchemaOptions';
import createDecoratorOptions from '../../helpers/createDecoratorOptions';
import Log from '../../log';
import Type from './Type';
import { isExportDefault } from '../../helpers/exportHelper';

class Graph {
  public name!: string;
  public type!: GraphTypeEnum;
  public params!: GraphParam;
  public isExportDefaultController: boolean;
  public returnType?: string;
  public isReturnRequired: boolean;
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
    this.isReturnRequired = true;

    if (method.parameters[0] && GraphParam.isParamValid(method.parameters[0], sourceFile)) {
      this.params = new GraphParam(method.parameters[0], this, sourceFile);
    }

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

      if (ts.isUnionTypeNode(method.type)) {
        method.type.types.forEach(returnType => {
          if (returnType.kind === ts.SyntaxKind.UndefinedKeyword || returnType.kind === ts.SyntaxKind.NullKeyword) {
            this.isReturnRequired = false;
          } else {
            this.returnType = PrimitiveType.getPrimitiveType(returnType.getText(sourceFile));
          }
        });
      } else {
        this.returnType = PrimitiveType.getPrimitiveType(method.type!.getText(sourceFile));
      }
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
  }

  verifyAndUpdateType(scalars: string[], types: Type[]) {
    if (this.returnType) {
      const isArray = PrimitiveType.isArray(this.returnType);
      const singleReturnType = PrimitiveType.formatType(this.returnType);

      if (!scalars.includes(singleReturnType)) {
        const type = types.find(type => type.name === singleReturnType);
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
            this.returnType = isArray ? PrimitiveType.formatArray(type.options.name) : type.options.name;
          }
        }
      }
    }
  }

  toStringType(): string {
    let typeString = '';
    const name = this.options.name || this.name;
    const requiredReturn = this.isReturnRequired ? '!' : '';

    if (this.params) {
      const required = this.params.isRequired ? '!' : '';
      typeString += `  ${name}(${this.params.name}: ${this.params.type}${required}): ${this.returnType}${requiredReturn}\n`;
    } else {
      typeString += `  ${name}: ${this.returnType}${requiredReturn}\n`;
    }

    return `extend type ${this.type.toString()} {\n${typeString}}\n`;
  }
}

export default Graph;
