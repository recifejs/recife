import pathLibrary from 'path';
import Config from '../../Config';
class ImportDeclaration {
  public names: Array<string> = [];
  public path!: string;

  getPath() {
    const pathComplete = pathLibrary.join(
      Config.PATH_CONTROLLERS,
      this.path.replace(/\"|\'/g, '')
    );

    if (!pathComplete.includes('.ts')) {
      return pathComplete + '.ts';
    }

    return pathComplete;
  }
}

export default ImportDeclaration;
