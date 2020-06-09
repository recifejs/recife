import path from 'path';
import Config from './configs/Config';

class Recife {
  static PATH_BASE: string;
  static PATH_BASE_ABSOLUTE: string;
  static PATH_BUILD: string;
  static PATH_CONTROLLERS: string;
  static PATH_MODELS: string;
  static NODE_PORT: number;
  static NODE_HOST: string;

  constructor(config: Config) {
    Recife.PATH_BASE = config.basePath;
    Recife.PATH_BASE_ABSOLUTE = path.join(process.cwd(), Recife.PATH_BASE);
    Recife.PATH_BUILD = path.join(process.cwd(), this.readTsconfig());
    Recife.PATH_CONTROLLERS = path.join(process.cwd(), Recife.PATH_BASE, 'controllers');
    Recife.PATH_MODELS = path.join(process.cwd(), Recife.PATH_BASE, 'models');
    Recife.NODE_PORT = config.port;
    Recife.NODE_HOST = config.host;
  }

  private readTsconfig(): string {
    return require(path.join(process.cwd(), 'tsconfig.json')).compilerOptions.outDir;
  }
}

export default Recife;
