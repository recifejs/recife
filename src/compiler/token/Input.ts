import * as ts from 'typescript';
import Field from './Field';
import FieldTypeEnum from '../enum/FieldTypeEnum';
import { getReference } from '../../helpers/referenceHelper';

class Input {
  public name: string;
  public fields: Field[];
  public path: string;
  public sourceFile?: ts.SourceFile;
  public node: ts.Node;

  constructor(node: ts.Node, path: string, sourceFile?: ts.SourceFile, fieldName?: string) {
    this.fields = [];
    this.sourceFile = sourceFile;
    this.path = path;
    this.name = '';
    this.node = node;

    if (fieldName) {
      this.name = fieldName;
    }

    if (ts.isTypeLiteralNode(node)) {
      this.compileObject(node);
    } else if (ts.isTypeAliasDeclaration(node)) {
      if (!fieldName) {
        this.name = node.name.getText(this.sourceFile);
      }
      this.compileTypeLiteral(node);
    } else if (ts.isClassDeclaration(node) || ts.isInterfaceDeclaration(node)) {
      if (node.name) {
        if (!fieldName) {
          this.name = node.name.getText(this.sourceFile);
        }
        this.compileClassAndInterface(node);
      }

      if (node.heritageClauses) {
        node.heritageClauses.forEach((heritage: ts.HeritageClause) => {
          const nodeHeritage = getReference(heritage.types[0].expression.getText(sourceFile), sourceFile!);

          if (nodeHeritage) {
            const inputHeritage = new Input(nodeHeritage, '', sourceFile, this.name);
            this.fields = this.fields.concat(inputHeritage.fields);
          }
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
