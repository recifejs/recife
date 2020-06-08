import * as ts from 'typescript';
import Field from './Field';
import PrimitiveType from '../PrimitiveType';

class Type {
  public name!: string;
  public fields!: Field[];
  public isExportDefaultModel: boolean;
  public path: string;
  public nameModel: string;

  constructor(node: ts.ClassDeclaration, path: string, isDefaultExternal: boolean, sourceFile?: ts.SourceFile) {
    this.fields = [];
    this.path = path;
    this.name = node.name!.getText(sourceFile).replace('Model', '');
    this.nameModel = node.name!.getText(sourceFile);

    this.isExportDefaultModel = isDefaultExternal || this.isDefault(node, sourceFile);

    node.members.map(nodeField => {
      if (ts.isPropertyDeclaration(nodeField)) {
        const field = new Field();
        field.name = nodeField.name.getText(sourceFile);
        field.type = PrimitiveType.getPrimitiveType(nodeField.type!.getText(sourceFile));
        field.isRequired = !nodeField.questionToken;

        this.fields.push(field);
      }
    });
  }

  private isDefault(node: ts.ClassDeclaration, sourceFile?: ts.SourceFile): boolean {
    let isDefault = false;

    if (node.modifiers) {
      node.modifiers.forEach(modifier => {
        if (modifier.getText(sourceFile) === 'default') {
          isDefault = true;
        }
      });
    }

    return isDefault;
  }
}

export default Type;
