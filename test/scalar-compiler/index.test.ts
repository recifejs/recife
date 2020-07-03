import * as ts from 'typescript';
import equal from 'fast-deep-equal';
import fs from 'fs';
import path from 'path';
import { assert } from 'chai';
import 'mocha';

import ScalarCompiler from '../../src/compiler/ScalarCompiler';

describe('ScalarCompiler tests', () => {
  const pathSnapshot = path.join(__dirname, 'snapshot');
  const folders = fs.readdirSync(pathSnapshot);

  folders.forEach(folder => {
    it(`test ${folder}`, () => {
      ScalarCompiler.Instance.clean();

      const file = path.join(pathSnapshot, folder, 'input.ts');
      const output = require(path.join(pathSnapshot, folder, 'output.js'));

      const program = ts.createProgram([file], { allowJs: true });
      ScalarCompiler.Instance.compile(file, program);

      assert.isTrue(equal(translateScalars(ScalarCompiler.Instance.getScalars()), output.scalars));
    });
  });
});

const translateScalars = (scalars: any[]) => {
  return destructor(
    scalars.map(scalar => {
      delete scalar.path;
      return scalar;
    })
  );
};

const destructor = (object: any) => {
  return JSON.parse(JSON.stringify(object));
};
