import path from 'path';
class Config {
  static PATH_BASE = './example';
  static PATH_CONTROLLERS = path.join(
    process.cwd(),
    Config.PATH_BASE,
    'src/controllers'
  );
  static PATH_MODELS = path.join(process.cwd(), Config.PATH_BASE, 'src/models');
  static PORT = 8100;
}

export default Config;
