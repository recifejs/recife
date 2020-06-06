import Koa from 'koa';

type CorsConfig = {
  enabled: boolean;
  origin?: ((ctx: Koa.Context) => string) | string;
  allowMethods?: string[] | string;
  exposeHeaders?: string[] | string;
  allowHeaders?: string[] | string;
  maxAge?: number | string;
  credentials?: boolean;
  keepHeadersOnError?: boolean;
};

export default CorsConfig;
