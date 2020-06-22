import * as ts from 'typescript';

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
    this.isExportDefault = isDefaultExternal || this.isDefault(nodeStatement, sourceFile);
    this.path = path;
  }

  private isDefault(node: ts.VariableStatement, sourceFile?: ts.SourceFile): boolean {
    let isDefault = false;

    if (node.modifiers) {
      node.modifiers.forEach(modifier => {
        if (modifier.kind === ts.SyntaxKind.DefaultKeyword.valueOf()) {
          isDefault = true;
        }
      });
    }

    return isDefault;
  }

  getNameScalar(): string {
    return this.name.replace('Scalar', '');
  }

  toStringType(): string {
    return `scalar ${this.getNameScalar()}\n`;
  }
}

export default Scalar;
