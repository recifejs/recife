import { assert } from 'chai';
import fs from 'fs';
import path from 'path';
import 'mocha';

import GraphCompiler from '../../src/compiler/GraphCompiler';

describe('GraphqCompiler tests', () => {
  const pathSnapshot = path.join(__dirname, 'snapshot');
  const folders = fs.readdirSync(pathSnapshot);

  folders.forEach(folder => {
    it(`test ${folder}`, () => {
      const output = require(path.join(pathSnapshot, folder, 'output.js'));
      const graphCompiler = new GraphCompiler(path.join(pathSnapshot, folder, 'input.ts'));
      graphCompiler.compile();
      assert.equal(JSON.stringify(graphCompiler.getGraphs()), JSON.stringify(output));
    });
  });
});
