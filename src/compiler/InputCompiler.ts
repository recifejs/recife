import * as ts from 'typescript';
import ScalarCompiler from './ScalarCompiler';
import TypeCompiler from './TypeCompiler';
import ImportDeclaration from './token/ImportDeclaration';
import Input from './token/Input';
import NameImportType from './type/NameImportType';

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

  compile(importDeclaration: ImportDeclaration, program: ts.Program, nameImport: NameImportType): Input {
    const inputSearch = this.findInput(importDeclaration, nameImport.name);

    if (!inputSearch) {
      this.sourceFile = program.getSourceFile(importDeclaration.getPath());
      const input = new Input({ type: 'InputImport', importDeclaration, nameImport }, this.sourceFile);
      this.inputs.push(input);
      return input;
    }

    return inputSearch;
  }

  compileObjectLiteral(node: ts.TypeLiteralNode, fieldName: string, path: string): Input {
    const input = new Input({ type: 'InputNode', node, fieldName, path }, this.sourceFile);
    this.inputs.push(input);

    return input;
  }

  private findInput(importDeclaration: ImportDeclaration, className: String): Input | undefined {
    return this.inputs.find(item => item.name === className && item.path === importDeclaration.getPath());
  }

  expand() {
    for (let i = 0; i < this.inputs.length; i++) {
      this.inputs[i].fields.forEach(field =>
        field.verifyAndUpdateType(
          ScalarCompiler.Instance.getNameScalars(),
          TypeCompiler.Instance.getTypes(),
          this.inputs
        )
      );
    }
  }

  toStringType(): string {
    return this.inputs.reduce((acc, input) => acc + input.toStringType(), '');
  }
}

export default InputCompiler;
