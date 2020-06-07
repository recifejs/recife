import * as ts from 'typescript';

import Type from './models/Type';
import Field from './models/Field';
import PrimitiveType from './PrimitiveType';

class TypeCompiler {
  private type: Type;
  private sourceFile: ts.SourceFile | undefined;

  constructor(file: string) {
    const program = ts.createProgram([file], { allowJs: true });
    this.sourceFile = program.getSourceFile(file);

    this.type = new Type();
    this.type.fields = new Array<Field>();
  }

  getType() {
    return this.type;
  }

  compile() {
    if (this.sourceFile) {
      ts.forEachChild(this.sourceFile, (node: ts.Node) => {
        if (ts.isClassDeclaration(node)) {
          if (this.isType(node)) {
            this.type.name = node
              .name!.getText(this.sourceFile)
              .replace('Model', '');
            node.members.map(item => this.compileField(item));
          }
        }
      });
    }
  }

  private compileField(node: ts.Node) {
    if (ts.isPropertyDeclaration(node)) {
      const field = new Field();
      field.name = node.name.getText(this.sourceFile);
      field.type = PrimitiveType.getPrimitiveType(
        node.type!.getText(this.sourceFile)
      );
      field.isRequired = !node.questionToken;

      this.type.fields.push(field);
    }
  }

  private isType(node: ts.ClassDeclaration): boolean {
    let isType = false;
    if (node.decorators) {
      node.decorators.map(decorator => {
        decorator.expression.forEachChild((expression: ts.Node) => {
          if (expression.getText(this.sourceFile) === 'Type') {
            isType = true;
          }
        });
      });
    }
    return isType;
  }
}

export default TypeCompiler;
