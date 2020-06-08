import * as ts from 'typescript';
import Type from './token/Type';

class TypeCompiler {
  private types: Type[];
  private sourceFile: ts.SourceFile | undefined;
  private path: string;

  constructor(path: string) {
    const program = ts.createProgram([path], { allowJs: true });
    this.sourceFile = program.getSourceFile(path);
    this.path = path;
    this.types = [];
  }

  getTypes() {
    return this.types;
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
        if (ts.isClassDeclaration(node) && node.name) {
          const isExportDefaultExternal = node.name.getText(this.sourceFile) === classExportDefault;

          if (this.isType(node) && (isExportDefaultExternal || this.isExport(node))) {
            this.types.push(new Type(node, this.path, isExportDefaultExternal, this.sourceFile));
          }
        }
      });
    }
  }

  private isType(node: ts.ClassDeclaration): boolean {
    let isType = false;
    if (node.decorators) {
      node.decorators.map(decorator => {
        decorator.expression.forEachChild((expression: ts.Node) => {
          if (expression.getText(this.sourceFile) === 'Type') {
            isType = true;
          }
        });
      });
    }
    return isType;
  }

  private isExport(node: ts.ClassDeclaration): boolean {
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

export default TypeCompiler;
