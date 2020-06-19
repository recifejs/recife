import Koa from 'koa';
import Router, { RouterContext } from '@koa/router';
import { ApolloServer } from 'apollo-server-koa';
import { Server } from 'http';
import choosePort from 'choose-port';
import open from 'open';
import path from 'path';
import fs from 'fs';

import generateHomepage from './templates/generateHomepage';

import Compiler from './compiler';
import Recife from './Recife';
import Config from './Config';
import { MiddlewareGlobalType } from './types/MiddlewareResultType';
import IServer from './interfaces/IServer';
import getMiddleware from './helpers/getMiddleware';
import Log from './log';
import requireUncached from './helpers/requireUncached';

class Program {
  compiler: Compiler;
  app = new Koa();
  router = new Router();
  config: Config;
  server?: Server;
  port: Number = 0;
  lifecycle?: IServer;
  lastUpdatedLifecycle?: Date;

  constructor() {
    this.config = Config.Instance;
    this.config.readConfigBase();
    this.getLifecycle();

    this.compiler = new Compiler(Recife.PATH_CONTROLLERS, Recife.PATH_MODELS, Recife.PATH_SCALARS);

    this.app.use(this.config.createBodyParser());
    const corsConfig = this.config.createCorsConfig();
    if (corsConfig) {
      this.app.use(corsConfig);
    }

    Recife.MIDDLEWARES = this.config.createMidddlewareConfig();

    this.router.get('/', (ctx: RouterContext) => {
      ctx.body = generateHomepage(Recife.APP_NAME, Recife.PACKAGE_JSON.version);
    });
  }

  start() {
    if (!this.server) {
      this.lifecycle && this.lifecycle.beforeMounted();
    } else {
      this.getLifecycle();
      this.lifecycle && this.lifecycle.beforeUpdated();
    }

    this.compiler.clean();
    this.compiler
      .compile()
      .then(() => {
        if (!this.server) {
          this.lifecycle && this.lifecycle.mounted();
        } else {
          this.lifecycle && this.lifecycle.updated();
        }

        Log.Instance.successHeap('Compiled graphql');

        const apolloServer = new ApolloServer({
          resolvers: this.compiler.generateResolvers(),
          typeDefs: this.compiler.generateType(),
          ...this.config.createGraphlConfig(),
          context: this.runContext
        });

        this.app.use(this.router.routes());

        apolloServer.applyMiddleware({ app: this.app });

        const port = Recife.NODE_PORT;
        const host = Recife.NODE_HOST;

        if (this.server) {
          this.server.close();

          this.server = this.app.listen({ port: this.port, host: host }, () => {
            Log.Instance.info(`Server restarted at http://${host}:${this.port}${apolloServer.graphqlPath}`);
            Log.Instance.jump();
          });
        } else {
          choosePort(port, host, (portValid: Number) => {
            this.port = portValid;

            this.server = this.app.listen({ port: portValid, host: host }, () => {
              Log.Instance.info(`Server ready at http://${host}:${this.port}${apolloServer.graphqlPath}`);
              Log.Instance.jump();
              setTimeout(() => {
                open(`http://${host}:${portValid}`);
              }, 2000);
            });
          });
        }
      })
      .catch(e => {
        this.lifecycle && this.lifecycle.catch(e);
        process.exit(1);
      });
  }

  async runContext({ ctx }: any) {
    let contextReturn: any = {};
    const keys = Object.keys(Recife.MIDDLEWARES.global);

    for (let i = 0; i < keys.length; i++) {
      let Middleware = getMiddleware(Recife.MIDDLEWARES.global[keys[i]]);

      const middleware = new Middleware();
      if (middleware.handle) {
        const config: MiddlewareGlobalType = {
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
          if (context) {
            contextReturn[keys[i]] = context;
          }
        });
      }
    }

    return contextReturn;
  }

  private getLifecycle() {
    const pathBuildLifecycle = path.join(Recife.PATH_BUILD, 'server.js');
    const pathLifecycle = path.join(Recife.PATH_BASE_ABSOLUTE, 'server.ts');

    if (fs.existsSync(pathBuildLifecycle)) {
      if (!this.lastUpdatedLifecycle || fs.statSync(pathLifecycle).mtimeMs > this.lastUpdatedLifecycle.getTime()) {
        this.lastUpdatedLifecycle = new Date();

        const Lifecycle = requireUncached(pathBuildLifecycle).default;
        const lifecycle: IServer = new Lifecycle();

        this.lifecycle = lifecycle;
      }
    }
  }
}

export default Program;
