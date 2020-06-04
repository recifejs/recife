import fs from "fs";
import path from "path";
import GraphCompiler from "./GraphCompiler";
import TypeCompiler from "./TypeCompiler";
import Config from "../Config";

class Compiler {
  compile() {
    const filesController: string[] = fs.readdirSync(Config.PATH_CONTROLLERS);
    filesController.forEach(file => {
      const nameFileAbsolute = path.join(Config.PATH_CONTROLLERS, file);

      const graphCompiler = new GraphCompiler(nameFileAbsolute);
      graphCompiler.compile();
    });

    const filesModel: string[] = fs.readdirSync(Config.PATH_MODELS);
    filesModel.forEach(file => {
      const nameFileAbsolute = path.join(Config.PATH_MODELS, file);

      const typeCompiler = new TypeCompiler(nameFileAbsolute);
      typeCompiler.compile();
    });
  }
}

export default Compiler;
