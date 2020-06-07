import * as ts from 'typescript';
import Field from './Field';
import PrimitiveType from '../PrimitiveType';

class Type {
  public name!: string;
  public fields!: Field[];

  constructor(node: ts.ClassDeclaration, sourceFile?: ts.SourceFile) {
    this.fields = [];
    this.name = node.name!.getText(sourceFile).replace('Model', '');

    node.members.map(nodeField => {
      if (ts.isPropertyDeclaration(nodeField)) {
        const field = new Field();
        field.name = nodeField.name.getText(sourceFile);
        field.type = PrimitiveType.getPrimitiveType(
          nodeField.type!.getText(sourceFile)
        );
        field.isRequired = !nodeField.questionToken;

        this.fields.push(field);
      }
    });
  }
}

export default Type;
