import path from 'path';

class Recife {
  static PATH_BASE = 'src';
  static PATH_BASE_ABSOLUTE = path.join(process.cwd(), Recife.PATH_BASE);
  static PATH_BUILD = path.join(process.cwd(), 'dist');
  static PATH_CONTROLLERS = path.join(
    process.cwd(),
    Recife.PATH_BASE,
    'controllers'
  );
  static PATH_MODELS = path.join(process.cwd(), Recife.PATH_BASE, 'models');
  static NODE_PORT = 8100;
  static NODE_HOST = 'localhost';
}

export default Recife;
