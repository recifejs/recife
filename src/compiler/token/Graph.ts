import * as ts from 'typescript';
import GraphParam from './GraphParam';
import GraphTypeEnum from '../enum/GraphTypeEnum';
import PrimitiveType from '../PrimitiveType';
import SchemaOptions from '../../types/SchemaOptions';
import createDecoratorOptions from '../../helpers/createDecoratorOptions';

class Graph {
  public name!: string;
  public type!: GraphTypeEnum;
  public params!: GraphParam;
  public isExportDefaultController: boolean;
  public returnType?: string;
  public nameController: string;
  public path: string;
  public options: SchemaOptions;

  constructor(
    method: ts.MethodDeclaration,
    classDecl: ts.ClassDeclaration,
    path: string,
    isDefaultExternal: boolean,
    sourceFile?: ts.SourceFile
  ) {
    this.nameController = classDecl.name!.getText(sourceFile);
    this.path = path;
    this.options = {};
    this.name = method.name.getText(sourceFile);
    this.isExportDefaultController = isDefaultExternal || this.isDefault(classDecl, sourceFile);

    if (method.parameters[0] && GraphParam.isParamValid(method.parameters[0], sourceFile)) {
      this.params = new GraphParam(method.parameters[0], sourceFile);
    }

    if (method.type) {
      if (ts.isUnionTypeNode(method.type)) {
        let returnNameType = '';
        method.type.types.forEach(returnType => {
          const textReturnType = returnType.getText(sourceFile);

          if (textReturnType !== 'undefined' && textReturnType !== 'null') {
            returnNameType = textReturnType;
          }
        });

        this.returnType = PrimitiveType.getPrimitiveType(returnNameType);
      } else {
        this.returnType = PrimitiveType.getPrimitiveType(method.type!.getText(sourceFile));
      }
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

  private isDefault(node: ts.ClassDeclaration, sourceFile?: ts.SourceFile): boolean {
    let isDefault = false;

    if (node.modifiers) {
      node.modifiers.forEach(modifier => {
        if (modifier.getText(sourceFile) === 'default') {
          isDefault = true;
        }
      });
    }

    return isDefault;
  }

  toStringType(): string {
    let typeString = '';
    const name = this.options.name || this.name;

    if (this.params) {
      const required = this.params.isRequired ? '!' : '';
      typeString += `  ${name}(${this.params.name}: ${this.params.type}${required}): ${this.returnType}\n`;
    } else {
      typeString += `  ${name}: ${this.returnType}\n`;
    }

    return typeString;
  }
}

export default Graph;
