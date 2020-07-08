import * as ts from 'typescript';
import os from 'os';

import ScalarCompiler from './ScalarCompiler';
import Type from './token/Type';
import ImportDeclaration from './token/ImportDeclaration';
import { isExport, getNameExportDefault } from '../helpers/exportHelper';
import InputCompiler from './InputCompiler';

class TypeCompiler {
  private static _instance: TypeCompiler;
  private types: Type[];
  private imports: ImportDeclaration[] = [];
  private sourceFile: ts.SourceFile | undefined;
  private path: string;

  constructor() {
    this.types = [];
    this.path = '';
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  getTypes() {
    return this.types;
  }

  clean() {
    this.types = [];
  }

  compile(path: string, program: ts.Program) {
    this.sourceFile = program.getSourceFile(path);
    this.path = path;

    if (this.sourceFile) {
      let classExportDefault = getNameExportDefault(this.sourceFile) || '';

      ts.forEachChild(this.sourceFile, (node: ts.Node) => {
        if (ts.isImportDeclaration(node)) {
          const importDeclaration = new ImportDeclaration(node, this.getFolder(), this.sourceFile);
          this.imports.push(importDeclaration);
        }

        if (ts.isClassDeclaration(node) && node.name) {
          const isExportDefaultExternal = node.name.getText(this.sourceFile) === classExportDefault;

          if (this.isType(node) && (isExportDefaultExternal || isExport(node))) {
            this.types.push(new Type(node, this.path, isExportDefaultExternal, this.imports, this.sourceFile));
          }
        }
      });
    }
  }

  compileObjectLiteral(node: ts.TypeLiteralNode, fieldName: string, path: string): Type {
    const type = new Type(node, path, false, [], this.sourceFile, fieldName);
    this.types.push(type);

    return type;
  }

  private getFolder(): string {
    const bar = os.platform() === 'win32' ? '\\' : '/';
    return this.path.substring(0, this.path.lastIndexOf(bar));
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

  expand() {
    this.types = this.types.map(type => {
      if (type.heritageName) {
        const heritageType = this.types.find(item => item.name === type.heritageName);
        if (heritageType) {
          type.setHeritageType(heritageType);
        }
      }

      type.fields.forEach(field => field.verifyAndUpdateType(ScalarCompiler.Instance.getNameScalars(), this.types, []));

      return type;
    });
  }

  toStringType(): string {
    return this.types.reduce((acc, type) => acc + type.toStringType(), '');
  }
}

export default TypeCompiler;
