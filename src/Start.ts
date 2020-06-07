import Compiler from '../src/compiler';
import Recife from '../src/Recife';
import path from 'path';
import Koa from 'koa';
import koaBody from 'koa-bodyparser';
import koaCors from '@koa/cors';
import { ApolloServer, Config } from 'apollo-server-koa';
import choosePort from 'choose-port';

import CorsConfig from './configs/CorsConfig';
import BodyParserConfig from './configs/BodyParserConfig';
import GraphqlConfig from './configs/GraphqlConfig';

class Start {
  compiler = new Compiler();
  app = new Koa();

  run() {
    this.compiler.compile();

    const server = new ApolloServer({
      resolvers: this.compiler.generateResolvers(),
      typeDefs: this.compiler.generateType(),
      //   context: loginController.validation.bind(loginController),
      ...this.createGraphlConfig()
    });

    this.createBodyParser();
    this.createCorsConfig();

    // app.route('/login').post(loginController.login.bind(loginController));
    // app.route('/signup').post(loginController.signup.bind(loginController));

    server.applyMiddleware({ app: this.app });

    const port = Recife.NODE_PORT;
    const host = Recife.NODE_HOST;

    choosePort(port, host, (portValid: Number) => {
      this.app.listen({ port: portValid, host: host }, () => {
        console.log(
          `🚀 Server ready at http://${host}:${portValid}${server.graphqlPath}`
        );
      });
    });
  }

  createBodyParser() {
    const bodyParserConfig: BodyParserConfig = require(path.join(
      Recife.PATH_BUILD,
      'config/bodyParser.js'
    )).default;

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

  createGraphlConfig(): Config {
    const graphqlConfig: GraphqlConfig = require(path.join(
      Recife.PATH_BUILD,
      'config/graphql.js'
    )).default;

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
    const corsConfig: CorsConfig = require(path.join(
      Recife.PATH_BUILD,
      'config/cors.js'
    )).default;

    if (corsConfig.enabled) {
      this.app.use(koaCors(corsConfig));
    }
  }
}

export default Start;
