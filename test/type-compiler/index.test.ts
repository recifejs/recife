import * as ts from 'typescript';
import fs from 'fs';
import path from 'path';
import { assert } from 'chai';
import 'mocha';

import TypeCompiler from '../../src/compiler/TypeCompiler';

describe('TypeCompiler tests', () => {
  const pathSnapshot = path.join(__dirname, 'snapshot');
  const folders = fs.readdirSync(pathSnapshot);

  folders.forEach(folder => {
    it(`test ${folder}`, () => {
      TypeCompiler.Instance.clean();

      const file = path.join(pathSnapshot, folder, 'input.ts');
      const output = require(path.join(pathSnapshot, folder, 'output.js'));

      const program = ts.createProgram([file], { allowJs: true });
      TypeCompiler.Instance.compile(file, program);

      assert.equal(translateTypes(TypeCompiler.Instance.getTypes()), JSON.stringify(output.types));
    });
  });
});

const translateTypes = (types: any[]) => {
  return JSON.stringify(
    types.map(type => {
      delete type.path;
      type.fields = type.fields.map((field: any) => {
        delete field.importDeclaration;
        delete field.node;
        delete field.sourceFile;
        delete field.path;

        return field;
      });
      return type;
    })
  );
};
