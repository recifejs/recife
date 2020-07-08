import * as ts from 'typescript';

export const getReference = (name: string, sourceFile: ts.SourceFile): ts.Node | undefined => {
  let nodeSearch: ts.Node | undefined = undefined;

  ts.forEachChild(sourceFile, (node: ts.Node) => {
    if (ts.isClassDeclaration(node) || ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) {
      if (node.name && node.name.getText(sourceFile) === name) {
        nodeSearch = node;
      }
    } else if (ts.isImportDeclaration(node)) {
      if (node.importClause) {
        if (node.importClause.name && node.importClause.name.getText(sourceFile) === name) {
          nodeSearch = node;
        }

        if (node.importClause.namedBindings) {
          node.importClause.namedBindings.forEachChild(nodeName => {
            if (ts.isImportSpecifier(nodeName) && nodeName.name.getText(sourceFile) === name) {
              nodeSearch = node;
            }
          });
        }
      }
    }
  });

  return nodeSearch;
};
