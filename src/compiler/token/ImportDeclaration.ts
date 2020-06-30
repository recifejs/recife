import * as ts from 'typescript';
import path from 'path';
import NameImportType from '../type/NameImportType';

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
        node.importClause.namedBindings.forEachChild(node => {
          if (ts.isImportSpecifier(node))
            this.names.push({
              name: node.propertyName ? node.propertyName.getText(sourceFile) : node.name.getText(sourceFile),
              nameAlias: node.propertyName ? node.name.getText(sourceFile) : undefined,
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
