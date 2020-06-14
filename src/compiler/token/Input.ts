import Field from './Field';
import ImportDeclaration from './ImportDeclaration';
import FieldCompiler from '../FieldCompiler';

class Input {
  public name!: string;
  public fields!: Field[];

  constructor(importDeclaration: ImportDeclaration, className: string) {
    const fieldCompiler = new FieldCompiler(importDeclaration!.getPath(), className);
    fieldCompiler.compile();

    this.name = className;
    this.fields = fieldCompiler.getFields();
  }

  toStringType(): string {
    let type = `input ${this.name} {\n`;

    this.fields.forEach(field => {
      const required = field.isRequired ? '!' : '';
      type += `  ${field.name}: ${field.type}${required} \n`;
    });

    type += '}\n';

    return type;
  }
}

export default Input;
