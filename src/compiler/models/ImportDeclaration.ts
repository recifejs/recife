import pathLibrary from "path";
import Config from "../../Config";
class ImportDeclaration {
  public names: Array<string> = [];
  public path!: string;

  getPath() {
    const pathComplete = pathLibrary.join(
      process.cwd(),
      Config.PATH_BASE,
      "controllers",
      this.path.replace(/\"/g, "")
    );

    if (!pathComplete.includes(".ts")) {
      return pathComplete + ".ts";
    }

    return pathComplete;
  }
}

export default ImportDeclaration;
