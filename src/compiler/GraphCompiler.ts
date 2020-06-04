import * as ts from "typescript";
import Graph from "./models/Graph";
import GraphParam from "./models/GraphParam";
import GraphTypeEnum from "./models/GraphTypeEnum";
import ImportDeclaration from "./models/ImportDeclaration";

class GraphCompiler {
  private graphs: Array<Graph> = [];
  private imports: Array<ImportDeclaration> = [];
  private sourceFile: ts.SourceFile | undefined;

  constructor(file: string) {
    const program = ts.createProgram([file], { allowJs: true });
    this.sourceFile = program.getSourceFile(file);
  }

  compile() {
    if (this.sourceFile) {
      ts.forEachChild(this.sourceFile, (node: ts.Node) => {
        if (ts.isImportDeclaration(node)) {
          const importDeclaration = new ImportDeclaration();
          importDeclaration.path = node.moduleSpecifier.getText(
            this.sourceFile
          );

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

        if (ts.isClassDeclaration(node)) {
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

                    switch (type) {
                      case "Query":
                        graph.type = GraphTypeEnum.QUERY;
                        break;
                      case "Mutation":
                        graph.type = GraphTypeEnum.MUTATION;
                        break;
                    }
                  });
                });
              }

              this.graphs.push(graph);
            }
          });
        }
      });
    }
  }
}

export default GraphCompiler;
