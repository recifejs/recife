import * as ts from 'typescript';

export const isExportDefault = (node: ts.Node) => {
  if (node.modifiers) {
    for (let i = 0; i < node.modifiers.length; i++) {
      if (node.modifiers[i].kind === ts.SyntaxKind.DefaultKeyword) {
        return true;
      }
    }
  }

  return false;
};

export const isExport = (node: ts.Node) => {
  if (node.modifiers) {
    for (let i = 0; i < node.modifiers.length; i++) {
      if (node.modifiers[i].kind === ts.SyntaxKind.ExportKeyword) {
        return true;
      }
    }
  }

  return false;
};

export const getNameExportDefault = (sourceFile: ts.SourceFile): string | undefined => {
  let classExportDefault;

  ts.forEachChild(sourceFile, (node: ts.Node) => {
    if (ts.isExportAssignment(node)) {
      classExportDefault = node.expression.getText(sourceFile);
    }
  });

  return classExportDefault;
};

export const findNodeExportDefault = (sourceFile: ts.SourceFile): ts.Node | undefined => {
  let nodeExport: ts.Node | undefined = undefined;
  const nodeNameExportDefault = getNameExportDefault(sourceFile);

  if (nodeNameExportDefault) {
    ts.forEachChild(sourceFile, (node: any) => {
      if (node.name && node.name.getText(sourceFile) === nodeNameExportDefault) {
        nodeExport = node;
      }
    });
  } else {
    ts.forEachChild(sourceFile, (node: ts.Node) => {
      if (isExportDefault(node)) {
        nodeExport = node;
      }
    });
  }

  return nodeExport;
};
