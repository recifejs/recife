import fs from "fs";
import path from "path";
import GraphCompiler from "./GraphCompiler";
import Config from "../Config";

class Compiler {
  compile() {
    const files: string[] = fs.readdirSync(Config.PATH_CONTROLLERS);
    files.forEach(file => {
      const nameFileAbsolute = path.join(Config.PATH_CONTROLLERS, file);

      const graphqCompiler = new GraphCompiler(nameFileAbsolute);
      graphqCompiler.compile();
      console.log(graphqCompiler.getGraphs());
    });
  }
}

export default Compiler;
