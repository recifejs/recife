import * as ts from 'typescript';
import Field from './Field';
import TypeOptions from '../../types/TypeOptions';
import createDecoratorOptions from '../../helpers/createDecoratorOptions';
import ImportDeclaration from './ImportDeclaration';
import { isExportDefault } from '../../helpers/exportHelper';

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
    node: ts.ClassDeclaration,
    path: string,
    isDefaultExternal: boolean,
    imports: ImportDeclaration[],
    sourceFile?: ts.SourceFile
  ) {
    this.fields = [];
    this.options = {};
    this.path = path;
    this.name = node.name!.getText(sourceFile).replace('Model', '');
    this.nameModel = node.name!.getText(sourceFile);

    this.isExportDefaultModel = isDefaultExternal || isExportDefault(node);

    node.members.forEach(member => {
      if (ts.isPropertyDeclaration(member)) {
        const field = new Field(member, this.path, imports, sourceFile);
        this.fields.push(field);
      }
    });

    if (node.heritageClauses) {
      node.heritageClauses.forEach((heritage: ts.HeritageClause) => {
        this.heritageName = heritage.types[0].expression.getText(sourceFile);
      });
    }

    this.getOptions(node, sourceFile);
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
