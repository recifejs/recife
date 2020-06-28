import * as ts from 'typescript';
import Field from './token/Field';
import ImportDeclaration from './token/ImportDeclaration';
import { findNodeExportDefault } from '../helpers/exportHelper';

class FieldCompiler {
  private sourceFile: ts.SourceFile | undefined;
  private className: string;
  private exportDefault: boolean;
  private fields: Field[] = [];
  private path: string;

  constructor(importDeclaration: ImportDeclaration, program: ts.Program, className: string) {
    const nameImport = importDeclaration.names.find(item => item.name === className);

    this.exportDefault = nameImport!.exportDefault;
    this.sourceFile = program.getSourceFile(importDeclaration.getPath());
    this.className = className;
    this.path = importDeclaration.getPath();
  }

  getFields() {
    return this.fields;
  }

  compile() {
    if (this.sourceFile) {
      if (this.exportDefault) {
        const node = findNodeExportDefault(this.sourceFile);
        this.compileType(node!);
      } else {
        ts.forEachChild(this.sourceFile, (node: ts.Node) => {
          this.compileType(node);
        });
      }
    }
  }

  private compileType(node: ts.Node) {
    if (ts.isTypeAliasDeclaration(node)) {
      if (this.exportDefault || node.name.getText(this.sourceFile) === this.className) {
        this.compileTypeLiteral(node);
      }
    } else if (ts.isClassDeclaration(node)) {
      if (this.exportDefault || node.name!.getText(this.sourceFile) === this.className) {
        this.compileClass(node);
      }
    } else if (ts.isInterfaceDeclaration(node)) {
      if (this.exportDefault || node.name.getText(this.sourceFile) === this.className) {
        this.compileInterface(node);
      }
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
      const field = new Field(node, this.path, [], this.sourceFile);
      this.fields.push(field);
    }
  }
}

export default FieldCompiler;
