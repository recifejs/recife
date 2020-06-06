/*
|------------|
|  RecifeJS  |
|------------|
*/

import { CorsConfig } from 'recife';

const corsConfig: CorsConfig = {
  enabled: true,
  origin: undefined,
  allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
  exposeHeaders: undefined,
  allowHeaders: undefined,
  maxAge: 90,
  credentials: false,
  keepHeadersOnError: true
};

export default corsConfig;
