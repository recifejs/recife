import * as ts from 'typescript';
import path from 'path';

type NameImportType = {
  name: string;
  exportDefault: boolean;
};

class ImportDeclaration {
  public names: NameImportType[] = [];
  public path: string;
  public pathImport: string;

  constructor(node: ts.ImportDeclaration, pathImport: string, sourceFile?: ts.SourceFile) {
    this.path = node.moduleSpecifier.getText(sourceFile);
    this.pathImport = pathImport;

    if (node.importClause) {
      if (node.importClause.name) {
        this.names.push({
          name: node.importClause.name!.getText(sourceFile),
          exportDefault: true
        });
      }

      if (node.importClause.namedBindings) {
        node.importClause.namedBindings.forEachChild((node: ts.Node) => {
          this.names.push({
            name: node.getText(sourceFile),
            exportDefault: false
          });
        });
      }
    }
  }

  getPath() {
    const pathComplete = path.resolve(this.pathImport, this.path.replace(/\"|\'/g, ''));

    if (!pathComplete.includes('.ts')) {
      return pathComplete + '.ts';
    }

    return pathComplete;
  }
}

export default ImportDeclaration;
