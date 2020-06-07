import * as ts from 'typescript';

import FieldCompiler from './FieldCompiler';

import Graph from './models/Graph';
import Input from './models/Input';
import ImportDeclaration from './models/ImportDeclaration';

class GraphCompiler {
  private graphs: Array<Graph> = [];
  private inputs: Map<string, Input> = new Map();
  private imports: Array<ImportDeclaration> = [];
  private sourceFile: ts.SourceFile | undefined;

  constructor(file: string) {
    const program = ts.createProgram([file], { allowJs: true });
    this.sourceFile = program.getSourceFile(file);
  }

  getGraphs() {
    return this.graphs;
  }

  getInputs() {
    return Array.from(this.inputs.values());
  }

  compile() {
    if (this.sourceFile) {
      ts.forEachChild(this.sourceFile, (node: ts.Node) => {
        if (ts.isImportDeclaration(node)) {
          this.compileImport(node);
        }

        if (ts.isClassDeclaration(node)) {
          this.compileGraphs(node);
        }
      });
    }
  }

  private compileImport(node: ts.ImportDeclaration) {
    const importDeclaration = new ImportDeclaration();
    importDeclaration.path = node.moduleSpecifier.getText(this.sourceFile);

    if (node.importClause) {
      if (node.importClause.name) {
        importDeclaration.names.push(
          node.importClause.name!.getText(this.sourceFile)
        );
      }

      if (node.importClause.namedBindings) {
        node.importClause.namedBindings.forEachChild((node: ts.Node) => {
          importDeclaration.names.push(node.getText(this.sourceFile));
        });
      }
    }

    this.imports.push(importDeclaration);
  }

  private compileGraphs(node: ts.ClassDeclaration) {
    node.members.forEach((member: ts.ClassElement) => {
      if (ts.isMethodDeclaration(member)) {
        const graph = new Graph(member, node, this.sourceFile);

        if (graph.type) {
          this.graphs.push(graph);

          if (graph.params) {
            this.createInput(graph.params.type);
          }
        }
      }
    });
  }

  private createInput(className: string) {
    if (!this.inputs.has(className)) {
      let importDeclaration: ImportDeclaration | undefined = undefined;

      this.imports.forEach((importDecl: ImportDeclaration) => {
        if (importDecl.names.some(item => item === className)) {
          importDeclaration = importDecl;
        }
      });

      if (importDeclaration) {
        const input = new Input(importDeclaration, className);
        this.inputs.set(className, input);
      }
    }
  }
}

export default GraphCompiler;
