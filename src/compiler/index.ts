import GraphCompiler from "./GraphCompiler";

class Compiler {
  compile() {
    const graphqCompiler = new GraphCompiler(
      "./example/controllers/TestController.ts"
    );

    graphqCompiler.compile();

    console.log(graphqCompiler.getGraphs());
  }
}

export default Compiler;
