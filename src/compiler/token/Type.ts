import * as ts from 'typescript';
import Field from './Field';
import PrimitiveType from '../PrimitiveType';
import TypeOptions from '../../types/TypeOptions';
import createDecoratorOptions from '../../helpers/createDecoratorOptions';
import Log from '../../log';

class Type {
  public name: string;
  public fields: Field[];
  public isExportDefaultModel: boolean;
  public path: string;
  public nameModel: string;
  public heritageName?: string;
  public heritageType?: Type;
  public options: TypeOptions;

  constructor(node: ts.ClassDeclaration, path: string, isDefaultExternal: boolean, sourceFile?: ts.SourceFile) {
    this.fields = [];
    this.options = {};
    this.path = path;
    this.name = node.name!.getText(sourceFile).replace('Model', '');
    this.nameModel = node.name!.getText(sourceFile);

    this.isExportDefaultModel = isDefaultExternal || this.isDefault(node, sourceFile);

    node.members.forEach(member => {
      if (ts.isPropertyDeclaration(member)) {
        if (member.type) {
          if (member.type.kind === ts.SyntaxKind.AnyKeyword.valueOf()) {
            Log.Instance.error({
              code: 'property-type-any',
              message: 'Property type can not any keyword',
              path: this.path,
              node: member,
              sourceFile
            });
          }

          const fieldTypeDecorator = this.findTypeDecorator(member, sourceFile);

          const field = new Field();
          field.name = member.name.getText(sourceFile);
          field.isRequired = !member.questionToken;

          if (ts.isUnionTypeNode(member.type)) {
            member.type.types.forEach(type => {
              if (type.kind === ts.SyntaxKind.UndefinedKeyword.valueOf()) {
                field.isRequired = false;
              } else {
                field.type = fieldTypeDecorator || PrimitiveType.getPrimitiveType(type.getText(sourceFile));
              }
            });
          } else {
            field.type = fieldTypeDecorator || PrimitiveType.getPrimitiveType(member.type.getText(sourceFile));
          }

          this.fields.push(field);
        } else {
          Log.Instance.error({
            code: 'type-not-exist',
            message: `Type not defined in property ${this.name}.`,
            path: this.path,
            node: member,
            sourceFile
          });
        }
      }
    });

    if (node.heritageClauses) {
      node.heritageClauses.forEach((heritage: ts.HeritageClause) => {
        this.heritageName = heritage.types[0].expression.getText(sourceFile);
      });
    }

    this.getOptions(node, sourceFile);
  }

  private isDefault(node: ts.ClassDeclaration, sourceFile?: ts.SourceFile): boolean {
    let isDefault = false;

    if (node.modifiers) {
      node.modifiers.forEach(modifier => {
        if (modifier.kind === ts.SyntaxKind.DefaultKeyword.valueOf()) {
          isDefault = true;
        }
      });
    }

    return isDefault;
  }

  private findTypeDecorator(nodeField: ts.PropertyDeclaration, sourceFile?: ts.SourceFile): string | undefined {
    if (nodeField.decorators) {
      const decorator = nodeField.decorators.find(item => {
        if (item.getText(sourceFile).includes('Field')) {
          return item;
        }
      });

      if (decorator) {
        let _type = undefined;
        decorator.expression.forEachChild(item => {
          if (ts.isStringLiteral(item)) {
            _type = item.getText(sourceFile).replace(/\"|\'/g, '');
          }
        });

        if (_type) {
          return _type;
        }
      }
    }
  }

  private getOptions(node: ts.ClassDeclaration, sourceFile?: ts.SourceFile) {
    node.decorators!.forEach(decorator => {
      decorator.expression.forEachChild((expression: ts.Node) => {
        if (ts.isObjectLiteralExpression(expression)) {
          this.options = { ...createDecoratorOptions(expression, sourceFile) };
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

    this.fields.forEach(field => {
      const required = field.isRequired ? '!' : '';
      type += `  ${field.name}: ${field.type}${required} \n`;
    });

    if (this.heritageType) {
      this.heritageType.fields.forEach(field => {
        const required = field.isRequired ? '!' : '';
        type += `  ${field.name}: ${field.type}${required} \n`;
      });
    }

    type += '}\n';

    return type;
  }
}

export default Type;
