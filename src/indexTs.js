const ts = require("typescript");

const source = "let x: string  = 'string'";
const file = "./example/TestController.ts";
let program = ts.createProgram([file], { allowJs: true });
const sourceFile = program.getSourceFile(file);

const graphql = { queries: [], mutations: [] };

ts.forEachChild(sourceFile, node => {
  if (node.name) {
    node.members.forEach(member => {
      if (member.decorators) {
        for (let i = 0; i < member.decorators.length; i++) {
          if (
            member.decorators[i].expression.expression.escapedText === "Query"
          ) {
            graphql.queries.push(member.name.escapedText);
            break;
          }

          if (
            member.decorators[i].expression.expression.escapedText ===
            "Mutation"
          ) {
            graphql.mutations.push(member.name.escapedText);
            break;
          }
        }
      }
    });
  }
});

console.log(graphql);
