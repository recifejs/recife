import * as ts from 'typescript';
import ScalarCompiler from './ScalarCompiler';
import TypeCompiler from './TypeCompiler';
import ImportDeclaration from './token/ImportDeclaration';
import Input from './token/Input';
import NameImportType from './type/NameImportType';
import { findNodeExportDefault } from '../helpers/exportHelper';
import { getReference } from '../helpers/referenceHelper';
import Log from '../log';

class InputCompiler {
  private static _instance: InputCompiler;
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
      const sourceFile = program.getSourceFile(importDeclaration.getPath());
      let node: ts.Node | undefined = undefined;

      if (sourceFile) {
        if (nameImport.exportDefault) {
          node = findNodeExportDefault(sourceFile);
        } else {
          node = getReference(nameImport.name, sourceFile);
        }
      }
      const input = new Input(node!, importDeclaration.getPath(), sourceFile);
      this.addInput(input);
      return input;
    }

    return inputSearch;
  }

  compileObjectLiteral(node: ts.TypeLiteralNode, fieldName: string, path: string, sourceFile?: ts.SourceFile): Input {
    const input = new Input(node, path, sourceFile, fieldName);
    this.addInput(input);
    return input;
  }

  compileNode(node: ts.Node, path: string, sourceFile: ts.SourceFile): Input {
    const input = new Input(node, path, sourceFile);
    this.addInput(input);
    return input;
  }

  private addInput(input: Input) {
    const countExistName = this.findInputName(input.name).length;
    if (countExistName > 0) {
      input.name += `_${countExistName}`;

      Log.Instance.warn({
        code: 'input-repeat-name',
        message: 'Input name is already exist',
        path: input.path,
        node: input.node,
        sourceFile: input.sourceFile
      });
    }

    this.inputs.push(input);
  }

  private findInput(importDeclaration: ImportDeclaration, className: String): Input | undefined {
    return this.inputs.find(item => item.name === className && item.path === importDeclaration.getPath());
  }

  private findInputName(className: String): Input[] {
    return this.inputs.filter(item => item.name === className);
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
