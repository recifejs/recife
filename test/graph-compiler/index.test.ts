import * as ts from 'typescript';
import fs from 'fs';
import path from 'path';
import { assert } from 'chai';
import 'mocha';

import GraphCompiler from '../../src/compiler/GraphCompiler';

describe('GraphCompiler tests', () => {
  const pathSnapshot = path.join(__dirname, 'snapshot');
  const folders = fs.readdirSync(pathSnapshot);

  folders.forEach(folder => {
    it(`test ${folder}`, () => {
      const file = path.join(pathSnapshot, folder, 'input.ts');
      const program = ts.createProgram([file], { allowJs: true });

      const output = require(path.join(pathSnapshot, folder, 'output.js'));
      const graphCompiler = new GraphCompiler(file, program, path.join(pathSnapshot, folder));
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
      delete graph.path;
      return graph;
    })
  );
};

const translateInputs = (inputs: any[]) => {
  return JSON.stringify(inputs);
};
