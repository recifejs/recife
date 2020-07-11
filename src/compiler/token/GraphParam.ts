import * as ts from 'typescript';
import Log from '../../log';
import capitalize from '../../helpers/capitalize';

class GraphParam {
  public name!: string;
  public type!: string;
  public isRequired!: boolean;

  constructor(parameter: ts.ParameterDeclaration, path: string, nameGraph: string, sourceFile?: ts.SourceFile) {
    if (parameter.type) {
      if (parameter.type.kind === ts.SyntaxKind.AnyKeyword) {
        Log.Instance.error({
          code: 'param-type-any',
          message: 'Param type can not any keyword',
          path,
          node: parameter,
          sourceFile
        });
      }

      this.name = parameter.name.getText(sourceFile);
      this.isRequired = !parameter.questionToken;

      if (ts.isUnionTypeNode(parameter.type)) {
        parameter.type.types.forEach(type => {
          if (type.kind === ts.SyntaxKind.NullKeyword || type.kind === ts.SyntaxKind.UndefinedKeyword) {
            this.isRequired = false;
          } else {
            this.type = type.getText(sourceFile);
          }
        });
      } else if (ts.isTypeLiteralNode(parameter.type)) {
        this.type = `${capitalize(nameGraph)}Parameter`;
      } else {
        this.type = parameter.type.getText(sourceFile);
      }
    } else {
      Log.Instance.error({
        code: 'param-type-not-defined',
        message: 'Not defined param type.',
        path,
        node: parameter,
        sourceFile
      });
    }
  }

  static isParamValid(parameter: ts.ParameterDeclaration, sourceFile?: ts.SourceFile): boolean {
    return parameter.name.getText(sourceFile) !== '_';
  }
}

export default GraphParam;
