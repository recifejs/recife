import * as ts from 'typescript';
import Field from './Field';
import ImportDeclaration from './ImportDeclaration';
import { findNodeExportDefault } from '../../helpers/exportHelper';
import NameImportType from '../type/NameImportType';
import FieldTypeEnum from '../enum/FieldTypeEnum';

type InputImport = {
  type: 'InputImport';
  importDeclaration: ImportDeclaration;
  nameImport: NameImportType;
};

type InputNode = {
  type: 'InputNode';
  node: ts.TypeLiteralNode;
  fieldName: string;
  path: string;
};

class Input {
  public name: string;
  public fields: Field[];
  public path: string;
  private sourceFile?: ts.SourceFile;
  private exportDefault: boolean;

  constructor(params: InputNode | InputImport, sourceFile?: ts.SourceFile) {
    this.fields = [];
    this.sourceFile = sourceFile;

    switch (params.type) {
      case 'InputNode':
        this.name = params.fieldName;
        this.path = params.path;
        this.exportDefault = false;
        this.compileObject(params.node);
        break;
      case 'InputImport':
      default:
        this.exportDefault = params.nameImport.exportDefault;
        this.path = params.importDeclaration.getPath();
        this.name = params.nameImport.name;

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
        break;
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
    } else if (ts.isClassDeclaration(node) || ts.isInterfaceDeclaration(node)) {
      if (this.exportDefault || node.name!.getText(this.sourceFile) === this.name) {
        if (this.exportDefault) {
          this.name = node.name!.getText(this.sourceFile);
        }
        this.compileClassAndInterface(node);
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

  private compileClassAndInterface(node: ts.ClassDeclaration | ts.InterfaceDeclaration) {
    node.members.forEach((member: ts.Node) => {
      this.compileField(member);
    });
  }

  private compileObject(node: ts.TypeLiteralNode) {
    node.members.forEach((member: ts.Node) => {
      this.compileField(member);
    });
  }

  private compileField(node: ts.Node) {
    if (ts.isPropertySignature(node) || ts.isPropertyDeclaration(node)) {
      const field = new Field(node, this.path, this.name, [], FieldTypeEnum.INPUT, this.sourceFile);
      this.fields.push(field);
    }
  }
}

export default Input;
