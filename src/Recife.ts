import path from 'path';
class Recife {
  static PATH_BASE = 'example/src';
  static PATH_BUILD = path.join(process.cwd(), 'example/dist');
  static PATH_CONTROLLERS = path.join(
    process.cwd(),
    Recife.PATH_BASE,
    'controllers'
  );
  static PATH_MODELS = path.join(process.cwd(), Recife.PATH_BASE, 'models');
  static GRAPHQL_INTROSPECT = true;
  static GRAPHQL_PLAYGROUND = true;
  static NODE_PORT = 8100;
}

export default Recife;
