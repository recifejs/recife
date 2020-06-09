import ts, { ModuleKind } from 'typescript';
import path from 'path';
import Koa from 'koa';
import koaBody from 'koa-bodyparser';
import koaCors from '@koa/cors';
import Router, { RouterContext } from '@koa/router';
import { ApolloServer } from 'apollo-server-koa';
import choosePort from 'choose-port';
import fs from 'fs';
import vm from 'vm';
import open from 'open';

import generateHomepage from './templates/generateHomepage';

import Compiler from '../src/compiler';
import Recife from '../src/Recife';

import CorsConfig from './configs/CorsConfig';
import BodyParserConfig from './configs/BodyParserConfig';
import GraphqlConfig from './configs/GraphqlConfig';
import AppConfig from './configs/AppConfig';

class Start {
  compiler = new Compiler();
  app = new Koa();
  router = new Router();

  run() {
    this.readConfigBase();

    this.compiler.compile();

    const server = new ApolloServer({
      resolvers: this.compiler.generateResolvers(),
      typeDefs: this.compiler.generateType(),
      ...this.createGraphlConfig()
    });

    this.createBodyParser();
    this.createCorsConfig();

    this.router.get('/', (ctx: RouterContext) => {
      ctx.body = generateHomepage(Recife.APP_NAME, Recife.PACKAGE_JSON.version);
    });

    this.app.use(this.router.routes());

    server.applyMiddleware({ app: this.app });

    const port = Recife.NODE_PORT;
    const host = Recife.NODE_HOST;

    choosePort(port, host, (portValid: Number) => {
      this.app.listen({ port: portValid, host: host }, () => {
        console.log(`🚀 Server ready at http://${host}:${portValid}${server.graphqlPath}`);
        open(`http://${host}:${portValid}`);
      });
    });
  }

  createBodyParser() {
    const bodyParserConfig: BodyParserConfig = this.readConfigFile(path.join(process.cwd(), 'config/bodyParser.ts'));

    this.app.use(
      koaBody({
        enableTypes: bodyParserConfig.enableTypes,
        encode: bodyParserConfig.encode,
        formLimit: bodyParserConfig.limit.form,
        jsonLimit: bodyParserConfig.limit.json,
        textLimit: bodyParserConfig.limit.form,
        strict: bodyParserConfig.strict,
        detectJSON: bodyParserConfig.detectJSON,
        extendTypes: bodyParserConfig.extendTypes,
        onerror: bodyParserConfig.onerror
      })
    );
  }

  createGraphlConfig() {
    const graphqlConfig: GraphqlConfig = this.readConfigFile(path.join(process.cwd(), 'config/graphql.ts'));

    return {
      playground: graphqlConfig.playground,
      introspection: graphqlConfig.introspection,
      debug: graphqlConfig.debug,
      mocks: graphqlConfig.mocks,
      mockEntireSchema: graphqlConfig.mockEntireSchema,
      rootValue: graphqlConfig.rootValue
    };
  }

  createCorsConfig() {
    const corsConfig: CorsConfig = this.readConfigFile(path.join(process.cwd(), 'config/cors.ts'));

    if (corsConfig.enabled) {
      this.app.use(koaCors(corsConfig));
    }
  }

  readConfigBase() {
    const config: AppConfig = this.readConfigFile(path.join(process.cwd(), 'config/app.ts'));
    new Recife(config);
  }

  readConfigFile(filePath: string) {
    const sourceTs = fs.readFileSync(filePath);
    const sourceJs = ts.transpileModule(sourceTs.toString(), {
      compilerOptions: {
        module: ModuleKind.CommonJS,
        moduleResolution: ts.ModuleResolutionKind.NodeJs,
        esModuleInterop: true,
        target: ts.ScriptTarget.ES2015,
        allowJs: true
      }
    }).outputText;

    const script = new vm.Script(`const exports = {}; ${sourceJs};`);
    return script.runInNewContext();
  }
}

export default Start;
