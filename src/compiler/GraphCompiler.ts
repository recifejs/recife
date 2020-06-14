import * as ts from 'typescript';

import Graph from './token/Graph';
import Input from './token/Input';
import ImportDeclaration from './token/ImportDeclaration';

class GraphCompiler {
  private graphs: Graph[] = [];
  private inputs: Map<string, Input> = new Map();
  private imports: Array<ImportDeclaration> = [];
  private sourceFile: ts.SourceFile | undefined;
  private path: string;
  private pathControllers: string;

  constructor(path: string, pathControllers: string) {
    const program = ts.createProgram([path], { allowJs: true });
    this.sourceFile = program.getSourceFile(path);
    this.path = path;
    this.pathControllers = pathControllers;
  }

  getGraphs() {
    return this.graphs;
  }

  getInputs() {
    return Array.from(this.inputs.values());
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
        if (ts.isImportDeclaration(node)) {
          this.compileImport(node);
        }

        if (ts.isClassDeclaration(node) && node.name) {
          if (node.name.getText(this.sourceFile) === classExportDefault || this.isExport(node)) {
            this.compileGraphs(node, node.name.getText(this.sourceFile) === classExportDefault);
          }
        }
      });
    }
  }

  private compileImport(node: ts.ImportDeclaration) {
    const importDeclaration = new ImportDeclaration(this.pathControllers);
    importDeclaration.path = node.moduleSpecifier.getText(this.sourceFile);

    if (node.importClause) {
      if (node.importClause.name) {
        importDeclaration.names.push(node.importClause.name!.getText(this.sourceFile));
      }

      if (node.importClause.namedBindings) {
        node.importClause.namedBindings.forEachChild((node: ts.Node) => {
          importDeclaration.names.push(node.getText(this.sourceFile));
        });
      }
    }

    this.imports.push(importDeclaration);
  }

  private compileGraphs(node: ts.ClassDeclaration, isDefault: boolean) {
    node.members.forEach((member: ts.ClassElement) => {
      if (ts.isMethodDeclaration(member)) {
        const graph = new Graph(member, node, this.path, isDefault, this.sourceFile);

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

export default GraphCompiler;
