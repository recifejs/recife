import path from 'path';
class Config {
  static PATH_BASE = 'src';
  static PATH_BUILD = path.join(process.cwd(), Config.PATH_BASE, 'dist');
  static PATH_CONTROLLERS = path.join(
    process.cwd(),
    Config.PATH_BASE,
    'controllers'
  );
  static PATH_MODELS = path.join(process.cwd(), Config.PATH_BASE, 'models');
  static PORT = 8100;
}

export default Config;
