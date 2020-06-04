import * as ts from "typescript";

const file = "./example/TestController.ts";

let program = ts.createProgram([file], { allowJs: true });
const sourceFile = program.getSourceFile(file);

const graphql = { queries: Array<string>(), mutations: Array<string>() };

if (sourceFile) {
  ts.forEachChild(sourceFile, (node: ts.Node) => {
    if (ts.isClassDeclaration(node)) {
      node.members.forEach((member: ts.ClassElement) => {
        if (ts.isMethodDeclaration(member)) {
          if (member.decorators) {
            member.decorators.forEach((decorator: ts.Decorator) => {
              decorator.expression.forEachChild((expression: ts.Node) => {
                const text = expression.getText(sourceFile);

                if (text === "Query") {
                  graphql.queries.push(member.name.getText(sourceFile));
                }
                if (text === "Mutation") {
                  graphql.mutations.push(member.name.getText(sourceFile));
                }
              });
            });
          }
        }
      });
    }
  });
}

console.log(graphql);
