import * as ts from 'typescript';

class GraphParam {
  public name!: string;
  public type!: string;
  public isRequired!: boolean;

  constructor(parameter: ts.ParameterDeclaration, sourceFile?: ts.SourceFile) {
    if (parameter.type) {
      this.name = parameter.name.getText(sourceFile);
      this.isRequired = !parameter.questionToken;

      if (ts.isUnionTypeNode(parameter.type)) {
        parameter.type.types.forEach(type => {
          if (
            type.kind === ts.SyntaxKind.NullKeyword.valueOf() ||
            type.kind === ts.SyntaxKind.UndefinedKeyword.valueOf()
          ) {
            this.isRequired = false;
          } else {
            this.type = type!.getText(sourceFile);
          }
        });
      } else {
        this.type = parameter.type!.getText(sourceFile);
      }
    }
  }

  static isParamValid(parameter: ts.ParameterDeclaration, sourceFile?: ts.SourceFile): boolean {
    return parameter.name.getText(sourceFile) !== '_';
  }
}

export default GraphParam;
