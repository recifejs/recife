import * as ts from 'typescript';

import FieldCompiler from './FieldCompiler';
import PrimitiveType from './PrimitiveType';

import Graph from './models/Graph';
import Input from './models/Input';
import GraphParam from './models/GraphParam';
import GraphTypeEnum from './models/GraphTypeEnum';
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
        const graph = new Graph();
        graph.nameContext = node
          .name!.getText(this.sourceFile)
          .replace('Controller', '');

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

          if (graph.params) {
            this.createInput(graph.params.type);
          }
        }
      }
    });
  }

  private createInput(name: string) {
    if (!this.inputs.has(name)) {
      let importDeclaration: ImportDeclaration | undefined = undefined;

      this.imports.forEach((importDecl: ImportDeclaration) => {
        if (importDecl.names.some(item => item === name)) {
          importDeclaration = importDecl;
        }
      });

      if (importDeclaration) {
        const fieldCompiler = new FieldCompiler(
          importDeclaration!.getPath(),
          name
        );
        fieldCompiler.compile();

        const input = new Input();
        input.name = name;
        input.fields = fieldCompiler.getFields();

        this.inputs.set(name, input);
      }
    }
  }
}

export default GraphCompiler;
