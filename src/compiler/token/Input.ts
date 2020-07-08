import * as ts from 'typescript';
import Field from './Field';
import FieldTypeEnum from '../enum/FieldTypeEnum';

type InputNode = {
  node: ts.Node;
  fieldName?: string;
  path: string;
};

class Input {
  public name: string;
  public fields: Field[];
  public path: string;
  public sourceFile?: ts.SourceFile;
  public node: ts.Node;

  constructor(params: InputNode, sourceFile?: ts.SourceFile) {
    this.fields = [];
    this.sourceFile = sourceFile;
    this.path = params.path;
    this.name = '';
    this.node = params.node;

    if (params.fieldName) {
      this.name = params.fieldName;
    }

    if (ts.isTypeLiteralNode(params.node)) {
      this.compileObject(params.node);
    } else if (ts.isTypeAliasDeclaration(params.node)) {
      this.name = params.node.name.getText(this.sourceFile);
      this.compileTypeLiteral(params.node);
    } else if (ts.isClassDeclaration(params.node) || ts.isInterfaceDeclaration(params.node)) {
      if (params.node.name) {
        this.name = params.node.name.getText(this.sourceFile);
        this.compileClassAndInterface(params.node);
      }
    }
  }

  toStringType(): string {
    let type = `input ${this.name} {\n`;

    this.fields.forEach(field => (type += field.toStringType()));

    type += '}\n';

    return type;
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
