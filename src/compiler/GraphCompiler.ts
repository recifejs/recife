import * as ts from 'typescript';

import FieldCompiler from './FieldCompiler';
import PrimitiveType from './PrimitiveType';

import Graph from './models/Graph';
import GraphParam from './models/GraphParam';
import GraphTypeEnum from './models/GraphTypeEnum';
import ImportDeclaration from './models/ImportDeclaration';

class GraphCompiler {
  private graphs: Array<Graph> = [];
  private imports: Array<ImportDeclaration> = [];
  private sourceFile: ts.SourceFile | undefined;

  constructor(file: string) {
    const program = ts.createProgram([file], { allowJs: true });
    this.sourceFile = program.getSourceFile(file);
  }

  getGraphs() {
    return this.graphs;
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

    this.graphs = this.graphs.map((graph: Graph) => {
      if (graph.params) {
        return this.compileFields(graph);
      }
      return graph;
    });
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
        const graph = new Graph();
        if (member.parameters[0]) {
          graph.params = new GraphParam();
          graph.params.name = member.parameters[0].name.getText(
            this.sourceFile
          );
          graph.params.type = member.parameters[0].type!.getText(
            this.sourceFile
          );
        }

        if (member.decorators) {
          member.decorators.forEach((decorator: ts.Decorator) => {
            decorator.expression.forEachChild((expression: ts.Node) => {
              const type = expression.getText(this.sourceFile);

              graph.name = member.name.getText(this.sourceFile);
              graph.returnType = PrimitiveType.getPrimitiveType(
                member.type!.getText(this.sourceFile)
              );

              switch (type) {
                case 'Query':
                  graph.type = GraphTypeEnum.QUERY;
                  break;
                case 'Mutation':
                  graph.type = GraphTypeEnum.MUTATION;
                  break;
                case 'Subscription':
                  graph.type = GraphTypeEnum.SUBSCRIPTION;
                  break;
              }
            });
          });
        }

        if (graph.type) {
          this.graphs.push(graph);
        }
      }
    });
  }

  private compileFields(graph: Graph): Graph {
    let importDeclaration: ImportDeclaration | undefined = undefined;

    if (graph.params) {
      this.imports.forEach((importDecl: ImportDeclaration) => {
        if (importDecl.names.some(item => item === graph.params.type)) {
          importDeclaration = importDecl;
        }
      });
    }

    if (importDeclaration) {
      const fieldCompiler = new FieldCompiler(
        importDeclaration!.getPath(),
        graph.params.type
      );

      fieldCompiler.compile();

      graph.params.fields = fieldCompiler.getFields();
    }

    return graph;
  }
}

export default GraphCompiler;
