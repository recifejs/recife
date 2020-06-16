import fs from 'fs';
import path from 'path';
import { assert } from 'chai';
import 'mocha';
import Recife from '../../src/Recife';

import Compiler from '../../src/compiler/Compiler';

describe('Compiler tests', () => {
  const pathSnapshot = path.join(__dirname, 'snapshot');
  const folders = fs.readdirSync(pathSnapshot);

  folders.forEach(folder => {
    it(`test ${folder}`, async () => {
      const output = require(path.join(pathSnapshot, folder, 'output.js'));
      const compiler = new Compiler(
        path.join(pathSnapshot, folder, 'controllers'),
        path.join(pathSnapshot, folder, 'models'),
        path.join(pathSnapshot, folder, 'scalars')
      );
      await compiler.compile();

      if (output.types) {
        assert.equal(JSON.stringify(compiler.generateType()), JSON.stringify(output.types));
      }

      if (output.resolvers) {
        assert.equal(JSON.stringify(compiler.generateResolvers()), JSON.stringify(output.resolvers));
      }

      compiler.clean();
    });
  });
});
