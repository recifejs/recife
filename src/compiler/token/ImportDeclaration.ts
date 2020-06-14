import path from 'path';
class ImportDeclaration {
  public names: string[] = [];
  public path!: string;
  public pathControllers: string;

  constructor(pathControllers: string) {
    this.pathControllers = pathControllers;
  }

  getPath() {
    const pathComplete = path.join(this.pathControllers, this.path.replace(/\"|\'/g, ''));

    if (!pathComplete.includes('.ts')) {
      return pathComplete + '.ts';
    }

    return pathComplete;
  }
}

export default ImportDeclaration;
