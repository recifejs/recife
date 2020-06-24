import * as ts from 'typescript';
import path from 'path';

class ImportDeclaration {
  public names: string[] = [];
  public path: string;
  public pathImport: string;

  constructor(node: ts.ImportDeclaration, pathImport: string, sourceFile?: ts.SourceFile) {
    this.path = node.moduleSpecifier.getText(sourceFile);
    this.pathImport = pathImport;

    if (node.importClause) {
      if (node.importClause.name) {
        this.names.push(node.importClause.name!.getText(sourceFile));
      }

      if (node.importClause.namedBindings) {
        node.importClause.namedBindings.forEachChild((node: ts.Node) => {
          this.names.push(node.getText(sourceFile));
        });
      }
    }
  }

  getPath() {
    const pathComplete = path.join(this.pathImport, this.path.replace(/\"|\'/g, ''));

    if (!pathComplete.includes('.ts')) {
      return pathComplete + '.ts';
    }

    return pathComplete;
  }
}

export default ImportDeclaration;
