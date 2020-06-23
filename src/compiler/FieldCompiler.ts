import * as ts from 'typescript';
import Field from './token/Field';

class FieldCompiler {
  private sourceFile: ts.SourceFile | undefined;
  private className: string;
  private fields: Field[] = [];
  private path: string;

  constructor(path: string, program: ts.Program, className: string) {
    this.sourceFile = program.getSourceFile(path);
    this.className = className;
    this.path = path;
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
    if (ts.isPropertySignature(node) || ts.isPropertyDeclaration(node)) {
      const field = new Field(node, this.path, this.sourceFile);
      this.fields.push(field);
    }
  }
}

export default FieldCompiler;
