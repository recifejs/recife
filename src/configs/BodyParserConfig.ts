import Koa from 'koa';

type BodyParserConfig = {
  /*
   * Parser will only parse when request type hits enableTypes.
   */
  enableTypes?: string[];
  /*
   * Requested encoding.
   */
  encode?: string;
  /*
   * Type Limits.
   */
  limit: {
    /*
     * Limit of the urlencoded body.
     */
    form?: string;
    /*
     * Limit of the json body.
     */
    json?: string;
    /*
     * Limit of the text body.
     */
    text?: string;
  };
  /*
   * When set to true, JSON parser will only accept arrays and objects.
   */
  strict?: boolean;
  /*
   * Custom json request detect function
   */
  detectJSON?: (ctx: Koa.Context) => boolean;
  /*
   * Support extend types
   */
  extendTypes?: {
    /*
     * Support json extend type
     */
    json?: string[];
    /*
     * Support form extend type
     */
    form?: string[];
    /*
     * Support text extend type
     */
    text?: string[];
  };
  /*
   * Support text extend type.
   */
  onerror?: (err: Error, ctx: Koa.Context) => void;
};

export default BodyParserConfig;
