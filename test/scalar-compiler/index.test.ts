import * as ts from 'typescript';
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
      const file = path.join(pathSnapshot, folder, 'input.ts');
      const program = ts.createProgram([file], { allowJs: true });

      const output = require(path.join(pathSnapshot, folder, 'output.js'));
      const scalarCompiler = new ScalarCompiler(file, program);
      scalarCompiler.compile();

      assert.equal(translateScalars(scalarCompiler.getScalars()), JSON.stringify(output.scalars));
    });
  });
});

const translateScalars = (scalars: any[]) => {
  return JSON.stringify(
    scalars.map(scalar => {
      delete scalar.path;
      return scalar;
    })
  );
};
