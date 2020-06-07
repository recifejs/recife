import * as ts from 'typescript';

class GraphParam {
  public name!: string;
  public type!: string;
  public isRequired!: boolean;

  constructor(parameter: ts.ParameterDeclaration, sourceFile?: ts.SourceFile) {
    this.name = parameter.name.getText(sourceFile);
    this.type = parameter.type!.getText(sourceFile);
    this.isRequired = !parameter.questionToken;
  }
}

export default GraphParam;
