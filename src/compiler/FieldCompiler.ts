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
        } else if (ts.isClassDeclaration(node)) {
          if (node.name!.getText(this.sourceFile) === this.className) {
            this.compileClass(node);
          }
        } else if (ts.isInterfaceDeclaration(node)) {
          if (node.name!.getText(this.sourceFile) === this.className) {
            this.compileInterface(node);
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

  private compileClass(node: ts.ClassDeclaration) {
    node.members.forEach(member => {
      this.compileField(member);
    });
  }

  private compileInterface(node: ts.InterfaceDeclaration) {
    node.members.forEach(member => {
      this.compileField(member);
    });
  }

  private compileField(node: ts.Node) {
    const field = new Field();

    if (ts.isPropertySignature(node) || ts.isPropertyDeclaration(node)) {
      field.name = node.name.getText(this.sourceFile);
      field.type = PrimitiveType.getPrimitiveType(node.type!.getText(this.sourceFile));
      field.isRequired = !node.questionToken;
    }

    if (field.name && field.type) {
      this.fields.push(field);
    }
  }
}

export default FieldCompiler;
