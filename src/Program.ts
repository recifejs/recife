import Koa from 'koa';
import Router, { RouterContext } from '@koa/router';
import { ApolloServer } from 'apollo-server-koa';
import { Server } from 'http';
import choosePort from 'choose-port';
import open from 'open';
import path from 'path';

import generateHomepage from './templates/generateHomepage';

import Compiler from './compiler';
import Recife from './Recife';
import Config from './Config';
import MiddlewareConfig from './configs/MiddlewareConfig';
import MiddlewareResultType from './types/MiddlewareResultType';

class Program {
  compiler = new Compiler();
  app = new Koa();
  router = new Router();
  config = new Config();
  server?: Server;
  port: Number = 0;
  middlewareConfig: MiddlewareConfig;

  constructor() {
    this.config.readConfigBase();
    this.app.use(this.config.createBodyParser());
    const corsConfig = this.config.createCorsConfig();
    if (corsConfig) {
      this.app.use(corsConfig);
    }

    this.middlewareConfig = this.config.createMidddlewareConfig();

    this.router.get('/', (ctx: RouterContext) => {
      ctx.body = generateHomepage(Recife.APP_NAME, Recife.PACKAGE_JSON.version);
    });
  }

  start() {
    this.compiler.clean();
    this.compiler.compile();
    console.log('Compiled graphql');

    const apolloServer = new ApolloServer({
      resolvers: this.compiler.generateResolvers(),
      typeDefs: this.compiler.generateType(),
      ...this.config.createGraphlConfig(),
      context: async ({ ctx }) => {
        let contextReturn: any = {};
        const keys = Object.keys(this.middlewareConfig.global);

        for (let i = 0; i < keys.length; i++) {
          const middlewareName = this.middlewareConfig.global[keys[i]];
          let Middleware = undefined;

          try {
            Middleware = require(path.join(process.cwd(), 'node_modules', middlewareName)).default;
          } catch (e) {
            try {
              Middleware = require(path.join(Recife.PATH_BUILD, middlewareName)).default;
            } catch (e) {
              console.error('Middleware not exists!');
            }
          }
          const middleware = new Middleware();
          if (middleware.handle) {
            const config: MiddlewareResultType = {
              request: {
                method: ctx.request.method,
                url: ctx.request.url,
                header: ctx.request.header
              },
              response: {
                status: ctx.response.status,
                message: ctx.response.message,
                header: ctx.response.header
              }
            };

            await middleware.handle(config, (context: any) => {
              contextReturn[keys[i]] = context;
            });
          }
        }

        return contextReturn;
      }
    });

    this.app.use(this.router.routes());

    apolloServer.applyMiddleware({ app: this.app });

    const port = Recife.NODE_PORT;
    const host = Recife.NODE_HOST;
    if (this.server) {
      this.server.close();

      this.server = this.app.listen({ port: this.port, host: host }, () => {
        console.log(`Server restarted at http://${host}:${this.port}${apolloServer.graphqlPath}`);
      });
    } else {
      choosePort(port, host, (portValid: Number) => {
        this.port = portValid;

        this.server = this.app.listen({ port: portValid, host: host }, () => {
          console.log(`Server ready at http://${host}:${this.port}${apolloServer.graphqlPath}`);
          open(`http://${host}:${portValid}`);
        });
      });
    }
  }
}

export default Program;
