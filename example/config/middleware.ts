import { MiddlewareConfig } from 'recife';

export const config: MiddlewareConfig = {
  middlewares: { auth: './middlewares/Auth' },
  global: {
    ConvertEmptyStringToNull: './middlewares/ConvertEmptyStringToNull'
  }
};
