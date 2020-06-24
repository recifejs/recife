import * as ts from 'typescript';
import fs from 'fs';
import path from 'path';
import { assert } from 'chai';
import 'mocha';

import FieldCompiler from '../../src/compiler/FieldCompiler';

describe('FieldCompiler tests', () => {
  const pathSnapshot = path.join(__dirname, 'snapshot');
  const folders = fs.readdirSync(pathSnapshot);

  folders.forEach(folder => {
    it(`test ${folder}`, () => {
      const file = path.join(pathSnapshot, folder, 'input.ts');
      const program = ts.createProgram([file], { allowJs: true });

      const output = require(path.join(pathSnapshot, folder, 'output.js'));
      const fieldCompiler = new FieldCompiler(file, program, 'UserInput');
      fieldCompiler.compile();

      assert.equal(translateField(fieldCompiler.getFields()), JSON.stringify(output.fields));
    });
  });
});

const translateField = (fields: any[]) => {
  return JSON.stringify(
    fields.map((field: any) => {
      delete field.importDeclaration;
      delete field.node;
      delete field.sourceFile;
      delete field.path;

      return field;
    })
  );
};
