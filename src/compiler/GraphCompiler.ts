import * as ts from 'typescript';
import os from 'os';

import ScalarCompiler from './ScalarCompiler';
import TypeCompiler from './TypeCompiler';
import Graph from './token/Graph';
import InputCompiler from './InputCompiler';
import ImportDeclaration from './token/ImportDeclaration';
import { isExport, getNameExportDefault } from '../helpers/exportHelper';
import NameImportType from './type/NameImportType';
import Input from './token/Input';

class GraphCompiler {
  private static _instance: GraphCompiler;
  private graphs: Graph[] = [];
  private imports: Array<ImportDeclaration> = [];
  private sourceFile: ts.SourceFile | undefined;
  private path: string;
  private program?: ts.Program;

  private constructor() {
    this.path = '';
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  getGraphs() {
    return this.graphs;
  }

  clean() {
    this.graphs = [];
  }

  compile(path: string, program: ts.Program) {
    this.sourceFile = program.getSourceFile(path);
    this.path = path;
    this.program = program;

    if (this.sourceFile) {
      let classExportDefault = getNameExportDefault(this.sourceFile) || '';

      ts.forEachChild(this.sourceFile, (node: ts.Node) => {
        if (ts.isImportDeclaration(node)) {
          const importDeclaration = new ImportDeclaration(node, this.getFolder(), this.sourceFile);
          this.imports.push(importDeclaration);
        }

        if (ts.isClassDeclaration(node) && node.name) {
          if (node.name.getText(this.sourceFile) === classExportDefault || isExport(node)) {
            this.compileGraphs(node, node.name.getText(this.sourceFile) === classExportDefault);
          }
        }
      });
    }
  }

  private getFolder(): string {
    const bar = os.platform() === 'win32' ? '\\' : '/';
    return this.path.substring(0, this.path.lastIndexOf(bar));
  }

  private compileGraphs(node: ts.ClassDeclaration, isDefault: boolean) {
    node.members.forEach((member: ts.ClassElement) => {
      if (ts.isMethodDeclaration(member)) {
        const graph = new Graph(member, node, this.path, isDefault, this.sourceFile);

        if (graph.type) {
          if (graph.params) {
            const input = this.createInput(graph.params.type);
            graph.params.type = input!.name;
          }

          this.graphs.push(graph);
        }
      }
    });
  }

  private createInput(className: string): Input | undefined {
    let importDeclaration: ImportDeclaration | undefined = undefined;
    let nameImport: NameImportType | undefined = undefined;

    this.imports.forEach((importDecl: ImportDeclaration) => {
      const nameImportSearch = importDecl.names.find(item => (item.nameAlias || item.name) === className);
      if (nameImportSearch) {
        importDeclaration = importDecl;
        nameImport = nameImportSearch;
      }
    });

    if (importDeclaration && nameImport) {
      const input = InputCompiler.Instance.compile(importDeclaration, this.program!, nameImport!);
      return input;
    }
  }

  expand() {
    for (let i = 0; i < this.graphs.length; i++) {
      this.graphs[i].verifyAndUpdateType(ScalarCompiler.Instance.getNameScalars(), TypeCompiler.Instance.getTypes());
    }
  }

  toStringType(): string {
    return this.graphs.reduce((acc, graph) => acc + graph.toStringType(), '');
  }
}

export default GraphCompiler;
