import { assert } from 'chai';
import 'mocha';
import generateHomepage from '../../src/templates/generateHomepage';

describe('GenerateHomepage tests', () => {
  it(`test generateHomePage`, () => {
    assert.isNotNull(generateHomepage('RECIFE', '1.0.0'));
  });
});
