"use strict";

process.env.BABEL_ENV = "production";

const babel = require("@babel/core");
const {
  exportDefaultDeclaration,
  exportNamedDeclaration,
  callExpression,
  assignmentExpression
} = require("@babel/types");
const fs = require("fs");

const isClass = declaration => {
  if (declaration.declarations) {
    return declaration.declarations.some(item => item.id.name === "_class");
  }
  return false;
};

const babelConfig = {
  ast: true,
  presets: ["@babel/typescript"],
  plugins: [
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    "@babel/proposal-object-rest-spread"
  ]
};

const resultTransform = babel.transformFileSync(
  "./example/TestController.ts",
  babelConfig
);

const getExportDefault = body => {
  let exportDefault;

  body.forEach(decl => {
    if (decl.type === exportDefaultDeclaration.name) {
      exportDefault = decl.declaration.name;
    }
  });

  if (!exportDefault) {
    body.forEach(decl => {
      if (decl.type === exportNamedDeclaration.name) {
        decl.specifiers.forEach(specified => {
          if (specified.exported.name === "default") {
            exportDefault = specified.local.name;
          }
        });
      }
    });
  }

  return exportDefault;
};

const getVariableDeclarationClass = (body, exportDefaultClass) => {
  let declaration;

  body.forEach(item => {
    if (item.declarations) {
      item.declarations.forEach(decl => {
        if (decl.id.name === exportDefaultClass) {
          declaration = item;
        }
      });
    }
  });

  return declaration;
};

const getDeclarationDecorators = (decorators, expressions) => {
  expressions.forEach(expression => {
    if (expression.type === assignmentExpression.name) {
      decorators = decorators.map(decorator => {
        if (
          decorator.namesDeclarationDecorator.includes(expression.left.name)
        ) {
          decorator.declarationDecorator.push(expression.right.callee.name);
        }

        return decorator;
      });
    }
  });

  return decorators;
};

const getDecorators = expressions => {
  let decorators = [];

  expressions.forEach(expression => {
    if (expression.expressions) {
      decorators = [...decorators, ...getDecorators(expression.expressions)];
    }
    if (
      expression.type === callExpression.name &&
      expression.callee.name == "_applyDecoratedDescriptor"
    ) {
      const namesDeclarationDecorator = expression.arguments[2].elements.map(
        item => item.name
      );

      decorators.push({
        name: expression.arguments[1].value,
        namesDeclarationDecorator,
        declarationDecorator: []
      });
    }
  });

  return decorators;
};

const body = resultTransform.ast.program.body;
const exportDefaultClass = getExportDefault(body);
const variableDeclarationClass = getVariableDeclarationClass(
  body,
  exportDefaultClass
);
const expressions = variableDeclarationClass.declarations[0].init.expressions;
let decorators = getDecorators(expressions);
decorators = getDeclarationDecorators(decorators, expressions);

console.log(decorators);
