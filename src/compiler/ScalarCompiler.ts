import * as ts from 'typescript';
import Scalar from './token/Scalar';
import { isExport } from '../helpers/exportHelper';

class ScalarCompiler {
  private static _instance: ScalarCompiler;
  private sourceFile: ts.SourceFile | undefined;
  private path: string;
  private scalars: Scalar[];
  private scalarsName: string[];

  constructor() {
    this.scalars = [];
    this.path = '';
    this.scalarsName = ['Int', 'Float', 'String', 'Boolean', 'ID', 'Date'];
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  getScalars() {
    return this.scalars;
  }

  getNameScalars() {
    return this.scalarsName;
  }

  clean() {
    this.scalars = [];
  }

  compile(path: string, program: ts.Program) {
    this.sourceFile = program.getSourceFile(path);
    this.path = path;

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

              if (this.isScalarType(declaration.type) && (isExportDefaultExternal || isExport(node))) {
                const scalar = new Scalar(declaration, node, this.path, isExportDefaultExternal, this.sourceFile);
                this.scalarsName.push(scalar.name);
                this.scalars.push(scalar);
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

  toStringType(): string {
    return this.scalars.reduce((acc, scalar) => acc + scalar.toStringType(), '');
  }
}

export default ScalarCompiler;
