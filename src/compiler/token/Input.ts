import * as ts from 'typescript';
import Field from './Field';
import ImportDeclaration from './ImportDeclaration';
import { findNodeExportDefault } from '../../helpers/exportHelper';
import NameImportType from '../type/NameImportType';

class Input {
  public name: string;
  public fields: Field[];
  public path: string;
  private sourceFile?: ts.SourceFile;
  private exportDefault: boolean;

  constructor(importDeclaration: ImportDeclaration, nameImport: NameImportType, sourceFile?: ts.SourceFile) {
    this.exportDefault = nameImport.exportDefault;
    this.path = importDeclaration.getPath();
    this.name = nameImport.name;
    this.sourceFile = sourceFile;
    this.fields = [];

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

  toStringType(): string {
    let type = `input ${this.name} {\n`;

    this.fields.forEach(field => (type += field.toStringType()));

    type += '}\n';

    return type;
  }

  private compileType(node: ts.Node) {
    if (ts.isTypeAliasDeclaration(node)) {
      if (this.exportDefault || node.name.getText(this.sourceFile) === this.name) {
        if (this.exportDefault) {
          this.name = node.name.getText(this.sourceFile);
        }
        this.compileTypeLiteral(node);
      }
    } else if (ts.isClassDeclaration(node)) {
      if (this.exportDefault || node.name!.getText(this.sourceFile) === this.name) {
        if (this.exportDefault) {
          this.name = node.name!.getText(this.sourceFile);
        }
        this.compileClass(node);
      }
    } else if (ts.isInterfaceDeclaration(node)) {
      if (this.exportDefault || node.name.getText(this.sourceFile) === this.name) {
        if (this.exportDefault) {
          this.name = node.name.getText(this.sourceFile);
        }
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

export default Input;
