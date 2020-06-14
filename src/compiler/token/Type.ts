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

    node.members.forEach(nodeField => {
      if (ts.isPropertyDeclaration(nodeField)) {
        const field = new Field();
        field.name = nodeField.name.getText(sourceFile);
        field.isRequired = !nodeField.questionToken;
        field.type = this.findType(nodeField, sourceFile);

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

  private findType(nodeField: ts.PropertyDeclaration, sourceFile?: ts.SourceFile): string {
    if (nodeField.decorators) {
      const decorator = nodeField.decorators.find(item => {
        if (item.getText(sourceFile).includes('Field')) {
          return item;
        }
      });

      if (decorator) {
        let _type = undefined;
        decorator.expression.forEachChild(item => {
          if (ts.isStringLiteral(item)) {
            _type = item.getText(sourceFile).replace(/\"|\'/g, '');
          }
        });

        if (_type) {
          return _type;
        }
      }
    }

    return PrimitiveType.getPrimitiveType(nodeField.type!.getText(sourceFile));
  }

  toStringType(): string {
    let type = `type ${this.name} {\n`;

    this.fields.forEach(field => {
      const required = field.isRequired ? '!' : '';
      type += `  ${field.name}: ${field.type}${required} \n`;
    });

    type += '}\n';

    return type;
  }
}

export default Type;
