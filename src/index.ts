import GraphCompiler from "./compiler/GraphCompiler";

const graphqCompiler = new GraphCompiler(
  "./example/controllers/TestController.ts"
);

graphqCompiler.compile();

console.log(graphqCompiler.getGraphs());
