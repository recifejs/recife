import fs from 'fs';
import equal from 'fast-deep-equal';
import path from 'path';
import { assert } from 'chai';
import 'mocha';

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
        assert.isTrue(equal(destructor(compiler.generateType()), destructor(output.types)));
      }

      if (output.resolvers) {
        assert.equal(JSON.stringify(compiler.generateResolvers()), JSON.stringify(output.resolvers));
      }

      compiler.clean();
    });
  });
});

const destructor = (object: any) => {
  return JSON.parse(JSON.stringify(object));
};
