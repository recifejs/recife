import * as ts from 'typescript';
import GraphParam from './GraphParam';
import GraphTypeEnum from '../enum/GraphTypeEnum';
import PrimitiveType from '../PrimitiveType';

class Graph {
  public name!: string;
  public type!: GraphTypeEnum;
  public params!: GraphParam;
  public nameContext!: string;
  public returnType?: string;

  constructor(
    method: ts.MethodDeclaration,
    classDecl: ts.ClassDeclaration,
    sourceFile?: ts.SourceFile
  ) {
    this.nameContext = classDecl
      .name!.getText(sourceFile)
      .replace('Controller', '');

    if (method.parameters[0]) {
      this.params = new GraphParam(method.parameters[0], sourceFile);
    }

    if (method.decorators) {
      method.decorators.forEach((decorator: ts.Decorator) => {
        decorator.expression.forEachChild((expression: ts.Node) => {
          this.name = method.name.getText(sourceFile);
          if (method.type) {
            if (ts.isUnionTypeNode(method.type)) {
              let returnNameType = '';
              method.type.types.forEach(returnType => {
                const textReturnType = returnType.getText(sourceFile);

                if (
                  textReturnType !== 'undefined' &&
                  textReturnType !== 'null'
                ) {
                  returnNameType = textReturnType;
                }
              });

              this.returnType = PrimitiveType.getPrimitiveType(returnNameType);
            } else {
              this.returnType = PrimitiveType.getPrimitiveType(
                method.type!.getText(sourceFile)
              );
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
}

export default Graph;
