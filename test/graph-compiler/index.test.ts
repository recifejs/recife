import * as ts from 'typescript';
import equal from 'fast-deep-equal';
import fs from 'fs';
import path from 'path';
import { assert } from 'chai';
import 'mocha';

import GraphCompiler from '../../src/compiler/GraphCompiler';
import InputCompiler from '../../src/compiler/InputCompiler';

describe('GraphCompiler tests', () => {
  const pathSnapshot = path.join(__dirname, 'snapshot');
  const folders = fs.readdirSync(pathSnapshot);

  folders.forEach(folder => {
    it(`test ${folder}`, () => {
      GraphCompiler.Instance.clean();
      InputCompiler.Instance.clean();

      const file = path.join(pathSnapshot, folder, 'input.ts');
      const output = require(path.join(pathSnapshot, folder, 'output.js'));

      const program = ts.createProgram([file], { allowJs: true });
      GraphCompiler.Instance.compile(file, program);

      if (output.graphs) {
        assert.isTrue(equal(translateGraphs(GraphCompiler.Instance.getGraphs()), output.graphs));
      }

      if (output.inputs) {
        assert.isTrue(equal(translateInputs(InputCompiler.Instance.getInputs()), output.inputs));
      }
    });
  });
});

const translateGraphs = (graphs: any[]) => {
  return destructor(
    graphs.map(graph => {
      delete graph.path;
      delete graph.node;
      delete graph.sourceFile;

      return Object.assign({}, graph);
    })
  );
};

const translateInputs = (inputs: any[]) => {
  return destructor(
    inputs.map(input => {
      delete input.path;
      delete input.sourceFile;

      input.fields = input.fields.map((field: any) => {
        delete field.importDeclaration;
        delete field.node;
        delete field.sourceFile;
        delete field.path;

        return field;
      });

      return input;
    })
  );
};

const destructor = (object: any) => {
  return JSON.parse(JSON.stringify(object));
};
