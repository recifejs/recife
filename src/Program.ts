import Koa from 'koa';
import Router, { RouterContext } from '@koa/router';
import { ApolloServer } from 'apollo-server-koa';
import { Server } from 'http';
import choosePort from 'choose-port';
import open from 'open';

import generateHomepage from './templates/generateHomepage';

import Compiler from './compiler';
import Recife from './Recife';
import Config from './Config';

class Program {
  compiler = new Compiler();
  app = new Koa();
  router = new Router();
  config = new Config();
  server?: Server;
  port: Number = 0;

  constructor() {
    this.config.readConfigBase();
    this.app.use(this.config.createBodyParser());
    const corsConfig = this.config.createCorsConfig();
    if (corsConfig) {
      this.app.use(corsConfig);
    }

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
      ...this.config.createGraphlConfig()
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
