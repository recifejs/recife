import * as ts from 'typescript';
import Scalar from './token/Scalar';

class ScalarCompiler {
  private sourceFile: ts.SourceFile | undefined;
  private path: string;
  private scalars: Scalar[];

  constructor(path: string, program: ts.Program) {
    this.sourceFile = program.getSourceFile(path);
    this.path = path;
    this.scalars = [];
  }

  getScalars() {
    return this.scalars;
  }

  compile() {
    if (this.sourceFile) {
      let classExportDefault = '';
      ts.forEachChild(this.sourceFile, (node: ts.Node) => {
        if (ts.isExportAssignment(node)) {
          classExportDefault = node.expression.getText(this.sourceFile);
        }
      });

      ts.forEachChild(this.sourceFile, (node: ts.Node) => {
        if (ts.isVariableStatement(node)) {
          node.declarationList.forEachChild(declaration => {
            if (ts.isVariableDeclaration(declaration) && declaration.name) {
              const isExportDefaultExternal = declaration.name.getText(this.sourceFile) === classExportDefault;

              if (this.isScalarType(declaration.type) && (isExportDefaultExternal || this.isExport(node))) {
                this.scalars.push(new Scalar(declaration, node, this.path, isExportDefaultExternal, this.sourceFile));
              }
            }
          });
        }
      });
    }
  }

  private isScalarType(type: ts.TypeNode | undefined) {
    if (!type) {
      return false;
    }

    if (type.getText(this.sourceFile) === 'ScalarType') {
      return true;
    }

    return false;
  }

  private isExport(node: ts.VariableStatement): boolean {
    let isExport = false;

    if (node.modifiers) {
      node.modifiers.forEach(modifier => {
        if (modifier.getText(this.sourceFile) === 'export') {
          isExport = true;
        }
      });
    }

    return isExport;
  }
}

export default ScalarCompiler;
