import Recife from '../Recife';
import getMiddleware from '../helpers/getMiddleware';

const execMiddlewares = async (middlewares?: string[], optionsSchema?: any): Promise<any> => {
  if (middlewares) {
    for (let i = 0; i < middlewares.length; i++) {
      const middlewareName = middlewares[i];

      if (Object.keys(Recife.MIDDLEWARES.middlewares).includes(middlewareName)) {
        const Middleware = getMiddleware(Recife.MIDDLEWARES.middlewares[middlewareName]);
        const middleware = new Middleware();

        await middleware.handle(optionsSchema, (context: any) => {
          if (optionsSchema.context && context) {
            optionsSchema.context[middlewareName] = context;
          }
        });
      } else {
        console.warn('Middleware not exists!');
      }
    }
  }

  return optionsSchema;
};

export default execMiddlewares;
