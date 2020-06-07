import * as ts from 'typescript';
import Type from './token/Type';

class TypeCompiler {
  private types: Type[];
  private sourceFile: ts.SourceFile | undefined;

  constructor(file: string) {
    const program = ts.createProgram([file], { allowJs: true });
    this.sourceFile = program.getSourceFile(file);
    this.types = [];
  }

  getTypes() {
    return this.types;
  }

  compile() {
    if (this.sourceFile) {
      ts.forEachChild(this.sourceFile, (node: ts.Node) => {
        if (ts.isClassDeclaration(node)) {
          if (this.isType(node)) {
            this.types.push(new Type(node, this.sourceFile));
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
}

export default TypeCompiler;
