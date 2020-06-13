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
      const output = require(path.join(pathSnapshot, folder, 'output.js'));
      const fieldCompiler = new FieldCompiler(path.join(pathSnapshot, folder, 'input.ts'), 'UserInput');
      fieldCompiler.compile();

      assert.equal(JSON.stringify(fieldCompiler.getFields()), JSON.stringify(output.fields));
    });
  });
});
