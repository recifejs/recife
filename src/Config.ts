import path from "path";
class Config {
  static PATH_BASE = "./example";
  static PATH_CONTROLLERS = path.join(
    process.cwd(),
    Config.PATH_BASE,
    "controllers"
  );
}

export default Config;
