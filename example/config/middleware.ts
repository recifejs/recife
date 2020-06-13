import { MiddlewareConfig } from 'recife';

export const config: MiddlewareConfig = {
  middlewares: {},
  global: {
    ConvertEmptyStringToNull: './middlewares/ConvertEmptyStringToNull'
  }
};
