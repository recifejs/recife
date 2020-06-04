import GraphCompiler from "./compiler/GraphCompiler";

const graphqCompiler = new GraphCompiler("./example/TestController.ts");

graphqCompiler.compile();
