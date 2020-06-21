type CorsConfig = {
  enabled: boolean;
  origin?: string;
  allowMethods?: string[] | string;
  exposeHeaders?: string[] | string;
  allowHeaders?: string[] | string;
  maxAge?: number | string;
  credentials?: boolean;
  keepHeadersOnError?: boolean;
};

export default CorsConfig;
