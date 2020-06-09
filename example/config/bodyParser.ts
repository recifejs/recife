/*
|------------|
|  RecifeJS  |
|------------|
*/

import { BodyParserConfig } from 'recife';

const bodyParserConfig: BodyParserConfig = {
  enableTypes: ['json', 'form'],
  encode: 'utf-8',
  limit: {
    form: '56kb',
    json: '1mb',
    text: '1mb'
  },
  strict: true,
  detectJSON: undefined,
  extendTypes: {
    json: undefined,
    form: undefined,
    text: undefined
  },
  onerror: undefined
};

export default bodyParserConfig;
