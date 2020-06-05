import pathLibrary from 'path';
import Recife from '../../Recife';
class ImportDeclaration {
  public names: string[] = [];
  public path!: string;

  getPath() {
    const pathComplete = pathLibrary.join(
      Recife.PATH_CONTROLLERS,
      this.path.replace(/\"|\'/g, '')
    );

    if (!pathComplete.includes('.ts')) {
      return pathComplete + '.ts';
    }

    return pathComplete;
  }
}

export default ImportDeclaration;
