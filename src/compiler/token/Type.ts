import * as ts from 'typescript';
import Field from './Field';
import TypeOptions from '../../types/TypeOptions';
import createDecoratorOptions from '../../helpers/createDecoratorOptions';
import ImportDeclaration from './ImportDeclaration';
import { isExportDefault } from '../../helpers/exportHelper';
import FieldTypeEnum from '../enum/FieldTypeEnum';

class Type {
  public name: string;
  public fields: Field[];
  public isExportDefaultModel: boolean;
  public path: string;
  public nameModel: string;
  public heritageName?: string;
  public heritageType?: Type;
  public options: TypeOptions;

  constructor(
    node: ts.ClassDeclaration | ts.TypeLiteralNode,
    path: string,
    isDefaultExternal: boolean,
    imports: ImportDeclaration[],
    sourceFile?: ts.SourceFile,
    name?: string
  ) {
    this.fields = [];
    this.options = {};
    this.path = path;
    if (ts.isTypeLiteralNode(node)) {
      this.name = name!;
      this.nameModel = name!;
    } else {
      this.name = node.name!.getText(sourceFile).replace('Model', '');
      this.nameModel = node.name!.getText(sourceFile);
    }

    this.isExportDefaultModel = isDefaultExternal || isExportDefault(node);

    node.members.forEach((member: ts.Node) => {
      if (ts.isPropertyDeclaration(member) || ts.isPropertySignature(member)) {
        const field = new Field(member, this.path, this.name, imports, FieldTypeEnum.TYPE, sourceFile);
        this.fields.push(field);
      }
    });

    if (ts.isClassDeclaration(node)) {
      if (node.heritageClauses) {
        node.heritageClauses.forEach((heritage: ts.HeritageClause) => {
          this.heritageName = heritage.types[0].expression.getText(sourceFile);
        });
      }

      this.getOptions(node, sourceFile);
    }
  }

  private getOptions(node: ts.ClassDeclaration, sourceFile?: ts.SourceFile) {
    node.decorators!.forEach(decorator => {
      decorator.expression.forEachChild((expression: ts.Node) => {
        if (ts.isObjectLiteralExpression(expression)) {
          this.options = createDecoratorOptions(expression, sourceFile);
        }
      });
    });
  }

  setHeritageType(heritageType: Type) {
    this.heritageType = heritageType;
  }

  toStringType(): string {
    if (this.options.onlyHeritage === true) {
      return '';
    }

    let type = `type ${this.options.name || this.name} {\n`;

    this.fields.forEach(field => (type += field.toStringType()));

    if (this.heritageType) {
      this.heritageType.fields.forEach(field => (type += field.toStringType()));
    }

    type += '}\n';

    return type;
  }
}

export default Type;
