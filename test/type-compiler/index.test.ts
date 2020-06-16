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
      const file = path.join(pathSnapshot, folder, 'input.ts');
      const program = ts.createProgram([file], { allowJs: true });

      const output = require(path.join(pathSnapshot, folder, 'output.js'));
      const typeCompiler = new TypeCompiler(file, program);
      typeCompiler.compile();

      assert.equal(translateTypes(typeCompiler.getTypes()), JSON.stringify(output.types));
    });
  });
});

const translateTypes = (types: any[]) => {
  return JSON.stringify(
    types.map(type => {
      delete type.path;
      return type;
    })
  );
};
