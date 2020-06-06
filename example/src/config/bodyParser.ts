/*
|------------|
|  RecifeJS  |
|------------|
*/

export default {
  /*
    Parser will only parse when request type hits enableTypes.
    Type: String[]
    Default: ['json', 'form']
  */
  enableTypes: ['json', 'form'],

  /*
    Requested encoding.
    Type: String
    Default: 'utf-8'
  */
  encode: 'utf-8',

  /*
    Type Limits.
    Type: Object
  */
  limit: {
    /*
      Limit of the urlencoded body.
      Type: String,
      Default: '56kb'
    */
    form: '56kb',

    /*
      Limit of the json body.
      Type: String,
      Default: '1mb'
    */
    json: '1mb',

    /*
      Limit of the text body.
      Type: String,
      Default: '1mb'
    */
    text: '1mb'
  },

  /*
    When set to true, JSON parser will only accept arrays and objects.
    Type: Boolean,
    Default: true
  */
  strict: true,

  /*
    Custom json request detect function
    Type: (ctx) => boolean,
    Default: null
  */
  detectJSON: null,

  /*
    Support extend types
    Type: Object
  */
  extendTypes: {
    /*
      Support json extend type
      Type: String[]
    */
    json: null,

    /*
      Support form extend type
      Type: String[]
    */
    form: null,

    /*
      Support text extend type
      Type: String[]
    */
    text: null
  },
  /*
    Support text extend type
    Type: (err, ctx) => void,
    Default: null
  */
  onerror: null
};
