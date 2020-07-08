import * as ts from 'typescript';
import os from 'os';

import ScalarCompiler from './ScalarCompiler';
import TypeCompiler from './TypeCompiler';
import Graph from './token/Graph';
import InputCompiler from './InputCompiler';
import ImportDeclaration from './token/ImportDeclaration';
import { isExport, getNameExportDefault } from '../helpers/exportHelper';
import { getReference } from '../helpers/referenceHelper';
import Input from './token/Input';

class GraphCompiler {
  private static _instance: GraphCompiler;
  private graphs: Graph[] = [];
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
    let sourceFile = program.getSourceFile(path);
    this.path = path;
    this.program = program;

    if (sourceFile) {
      let classExportDefault = getNameExportDefault(sourceFile) || '';

      ts.forEachChild(sourceFile, (node: ts.Node) => {
        if (ts.isClassDeclaration(node) && node.name) {
          if (node.name.getText(sourceFile) === classExportDefault || isExport(node)) {
            this.compileGraphs(node, node.name.getText(sourceFile) === classExportDefault, sourceFile!);
          }
        }
      });
    }
  }

  private getFolder(): string {
    const bar = os.platform() === 'win32' ? '\\' : '/';
    return this.path.substring(0, this.path.lastIndexOf(bar));
  }

  private compileGraphs(node: ts.ClassDeclaration, isDefault: boolean, sourceFile: ts.SourceFile) {
    node.members.forEach((member: ts.ClassElement) => {
      if (ts.isMethodDeclaration(member)) {
        const graph = new Graph(member, node, this.path, isDefault, sourceFile);

        if (graph.type) {
          if (graph.params) {
            const input = this.createInput(graph.params.type, sourceFile);
            graph.params.type = input!.name;
          }

          this.graphs.push(graph);
        }
      }
    });
  }

  private createInput(nameInput: string, sourceFile: ts.SourceFile): Input | undefined {
    const node: ts.Node | undefined = getReference(nameInput, sourceFile);

    if (node) {
      if (ts.isImportDeclaration(node)) {
        const importDeclaration = new ImportDeclaration(node, this.getFolder(), sourceFile);
        const nameImport = importDeclaration.names.find(item => (item.nameAlias || item.name) === nameInput);
        const input = InputCompiler.Instance.compile(importDeclaration, this.program!, nameImport!);

        return input;
      } else {
        const input = InputCompiler.Instance.compileNode(node, this.path, sourceFile);
        return input;
      }
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
