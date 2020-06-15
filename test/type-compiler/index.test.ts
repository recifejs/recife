import fs from 'fs';
import path from 'path';
import { assert } from 'chai';
import 'mocha';
import Recife from '../../src/Recife';

import TypeCompiler from '../../src/compiler/TypeCompiler';

describe('TypeCompiler tests', () => {
  const pathSnapshot = path.join(__dirname, 'snapshot');
  const folders = fs.readdirSync(pathSnapshot);

  folders.forEach(folder => {
    it(`test ${folder}`, () => {
      Recife.PATH_MODELS = path.join(pathSnapshot, folder);

      const output = require(path.join(pathSnapshot, folder, 'output.js'));
      const typeCompiler = new TypeCompiler(path.join(pathSnapshot, folder, 'input.ts'));
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
