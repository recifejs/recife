import * as ts from 'typescript';
import PrimitiveType from './PrimitiveType';
import Field from './token/Field';

class FieldCompiler {
  private sourceFile: ts.SourceFile | undefined;
  private className: string;
  private fields: Field[] = [];

  constructor(file: string, className: string) {
    const program = ts.createProgram([file], { allowJs: true });
    this.sourceFile = program.getSourceFile(file);
    this.className = className;
  }

  getFields() {
    return this.fields;
  }

  compile() {
    if (this.sourceFile) {
      ts.forEachChild(this.sourceFile, (node: ts.Node) => {
        if (ts.isTypeAliasDeclaration(node)) {
          if (node.name.getText(this.sourceFile) === this.className) {
            this.compileTypeLiteral(node);
          }
        }
      });
    }
  }

  private compileTypeLiteral(node: ts.TypeAliasDeclaration) {
    node.forEachChild(typeLiteral => {
      if (ts.isTypeLiteralNode(typeLiteral)) {
        typeLiteral.members.forEach(member => {
          this.compileField(member);
        });
      }
    });
  }

  private compileField(node: ts.Node) {
    const field = new Field();
    if (ts.isPropertySignature(node)) {
      field.name = node.name.getText(this.sourceFile);
      field.type = PrimitiveType.getPrimitiveType(
        node.type!.getText(this.sourceFile)
      );
      field.isRequired = !node.questionToken;
    }

    if (field.name && field.type) {
      this.fields.push(field);
    }
  }
}

export default FieldCompiler;
