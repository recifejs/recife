import * as ts from 'typescript';
import { isExportDefault } from '../../helpers/exportHelper';

class Scalar {
  public name!: string;
  public isExportDefault: boolean;
  public path: string;

  constructor(
    node: ts.VariableDeclaration,
    nodeStatement: ts.VariableStatement,
    path: string,
    isDefaultExternal: boolean,
    sourceFile?: ts.SourceFile
  ) {
    this.name = node.name.getText(sourceFile);
    this.isExportDefault = isDefaultExternal || isExportDefault(nodeStatement);
    this.path = path;
  }

  getNameScalar(): string {
    return this.name.replace('Scalar', '');
  }

  toStringType(): string {
    return `scalar ${this.getNameScalar()}\n`;
  }
}

export default Scalar;
