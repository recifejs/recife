import path from 'path';
import AppConfig from './configs/AppConfig';
import MiddlewareConfig from './configs/MiddlewareConfig';

class Recife {
  static APP_NAME: string;
  static PATH_BASE: string;
  static PATH_BASE_ABSOLUTE: string;
  static PATH_BUILD: string;
  static PATH_CONTROLLERS: string;
  static PATH_MODELS: string;
  static PATH_SCALARS: string;
  static NODE_PORT: number;
  static NODE_HOST: string;
  static PACKAGE_JSON: any;
  static MIDDLEWARES: MiddlewareConfig;
  static HTTP_FRAMEWORK: string;

  constructor(config: AppConfig) {
    Recife.APP_NAME = config.appName;
    Recife.PATH_BASE = config.basePath;
    Recife.PATH_BASE_ABSOLUTE = path.join(process.cwd(), Recife.PATH_BASE);
    Recife.PATH_BUILD = path.join(process.cwd(), this.readTsconfig());
    Recife.PATH_CONTROLLERS = path.join(process.cwd(), Recife.PATH_BASE, 'controllers');
    Recife.PATH_MODELS = path.join(process.cwd(), Recife.PATH_BASE, 'models');
    Recife.PATH_SCALARS = path.join(process.cwd(), Recife.PATH_BASE, 'scalars');
    Recife.NODE_PORT = config.port;
    Recife.NODE_HOST = config.host;
    Recife.HTTP_FRAMEWORK = config.httpFramework;
    Recife.PACKAGE_JSON = this.readPackageJson();
  }

  private readTsconfig(): string {
    return require(path.join(process.cwd(), 'tsconfig.json')).compilerOptions.outDir;
  }

  private readPackageJson(): any {
    return require(path.join(process.cwd(), 'package.json'));
  }
}

export default Recife;
