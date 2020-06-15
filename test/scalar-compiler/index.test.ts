import fs from 'fs';
import path from 'path';
import { assert } from 'chai';
import 'mocha';
import Recife from '../../src/Recife';

import ScalarCompiler from '../../src/compiler/ScalarCompiler';

describe('ScalarCompiler tests', () => {
  const pathSnapshot = path.join(__dirname, 'snapshot');
  const folders = fs.readdirSync(pathSnapshot);

  folders.forEach(folder => {
    it(`test ${folder}`, () => {
      Recife.PATH_SCALARS = path.join(pathSnapshot, folder);

      const output = require(path.join(pathSnapshot, folder, 'output.js'));
      const scalarCompiler = new ScalarCompiler(path.join(pathSnapshot, folder, 'input.ts'));
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
