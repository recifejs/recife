import * as ts from 'typescript';
import ScalarCompiler from './ScalarCompiler';
import TypeCompiler from './TypeCompiler';
import ImportDeclaration from './token/ImportDeclaration';
import Input from './token/Input';

class InputCompiler {
  private static _instance: InputCompiler;
  private sourceFile?: ts.SourceFile;
  private inputs: Input[];

  private constructor() {
    this.inputs = [];
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  getInputs() {
    return this.inputs;
  }

  clean() {
    this.inputs = [];
  }

  compile(importDeclaration: ImportDeclaration, program: ts.Program, className: string) {
    if (!this.existInput(importDeclaration, className)) {
      this.sourceFile = program.getSourceFile(importDeclaration.getPath());
      const input = new Input(importDeclaration, className, this.sourceFile);
      this.inputs.push(input);
    }
  }

  private existInput(importDeclaration: ImportDeclaration, className: String): boolean {
    return this.inputs.some(item => item.name === className && item.path === importDeclaration.path);
  }

  expand() {
    for (let i = 0; i < this.inputs.length; i++) {
      this.inputs[i].fields.forEach(field =>
        field.verifyAndUpdateType(ScalarCompiler.Instance.getNameScalars(), TypeCompiler.Instance.getTypes())
      );
    }
  }

  toStringType(): string {
    return this.inputs.reduce((acc, input) => acc + input.toStringType(), '');
  }
}

export default InputCompiler;
