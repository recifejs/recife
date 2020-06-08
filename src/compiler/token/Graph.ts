import * as ts from 'typescript';
import GraphParam from './GraphParam';
import GraphTypeEnum from '../enum/GraphTypeEnum';
import PrimitiveType from '../PrimitiveType';

class Graph {
  public name!: string;
  public type!: GraphTypeEnum;
  public params!: GraphParam;
  public isExportDefaultController: boolean;
  public returnType?: string;
  public nameController: string;
  public path: string;

  constructor(
    method: ts.MethodDeclaration,
    classDecl: ts.ClassDeclaration,
    path: string,
    isDefaultExternal: boolean,
    sourceFile?: ts.SourceFile
  ) {
    this.nameController = classDecl.name!.getText(sourceFile);
    this.path = path;

    if (method.parameters[0] && GraphParam.isParamValid(method.parameters[0], sourceFile)) {
      this.params = new GraphParam(method.parameters[0], sourceFile);
    }

    this.isExportDefaultController = isDefaultExternal || this.isDefault(classDecl, sourceFile);

    if (method.decorators) {
      method.decorators.forEach((decorator: ts.Decorator) => {
        decorator.expression.forEachChild((expression: ts.Node) => {
          this.name = method.name.getText(sourceFile);
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
}

export default Graph;
