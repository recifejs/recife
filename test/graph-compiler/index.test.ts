import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { assert } from 'chai';
import 'mocha';
import Recife from '../../src/Recife';

import GraphCompiler from '../../src/compiler/GraphCompiler';

describe('GraphqCompiler tests', () => {
  const pathSnapshot = path.join(__dirname, 'snapshot');
  const folders = fs.readdirSync(pathSnapshot);

  folders.forEach(folder => {
    it(`test ${folder}`, () => {
      Recife.PATH_CONTROLLERS = path.join(pathSnapshot, folder);

      const output = require(path.join(pathSnapshot, folder, 'output.js'));
      const graphCompiler = new GraphCompiler(path.join(pathSnapshot, folder, 'input.ts'));
      graphCompiler.compile();

      if (output.graphs) {
        assert.equal(translateGraphs(graphCompiler.getGraphs()), JSON.stringify(output.graphs));
      }

      if (output.inputs) {
        assert.equal(translateInputs(graphCompiler.getInputs()), JSON.stringify(output.inputs));
      }
    });
  });
});

const translateGraphs = (graphs: any[]) => {
  return JSON.stringify(
    graphs.map(graph => {
      graph.path = graph.path.replace(process.cwd(), '');
      return graph;
    })
  );
};

const translateInputs = (inputs: any[]) => {
  return JSON.stringify(inputs);
};
