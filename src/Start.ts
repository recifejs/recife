import * as ts from 'typescript';
import Koa from 'koa';
import Router, { RouterContext } from '@koa/router';
import { ApolloServer } from 'apollo-server-koa';
import { Server } from 'http';
import choosePort from 'choose-port';
import open from 'open';

import generateHomepage from './templates/generateHomepage';

import Compiler from '../src/compiler';
import Recife from '../src/Recife';
import Config from './Config';

class Start {
  compiler = new Compiler();
  app = new Koa();
  router = new Router();
  config = new Config();
  formatHost: ts.FormatDiagnosticsHost = {
    getCanonicalFileName: path => path,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: () => ts.sys.newLine
  };
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

  runWatch() {
    const configPath = ts.findConfigFile(process.cwd(), ts.sys.fileExists, 'tsconfig.json');
    if (!configPath) {
      throw new Error("Could not find a valid 'tsconfig.json'.");
    }

    const createProgram = ts.createSemanticDiagnosticsBuilderProgram;
    const host = ts.createWatchCompilerHost(configPath, {}, ts.sys, createProgram, undefined, () => {});

    const origCreateProgram = host.createProgram;
    host.createProgram = (rootNames: ReadonlyArray<string> | undefined, options, host, oldProgram) => {
      console.log('created the program!');
      return origCreateProgram(rootNames, options, host, oldProgram);
    };

    const origPostProgramCreate = host.afterProgramCreate;
    host.afterProgramCreate = program => {
      console.log('finished making the program!');
      origPostProgramCreate!(program);
      console.log('compiled the graphql');
      this.start();
    };

    ts.createWatchProgram(host);
  }
}

export default Start;
