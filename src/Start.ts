import Compiler from '../src/compiler';
import Recife from '../src/Recife';
import path from 'path';
import Koa from 'koa';
import koaBody from 'koa-bodyparser';
import { ApolloServer } from 'apollo-server-koa';

class Start {
  compiler = new Compiler();
  app = new Koa();

  run() {
    this.compiler.compile();

    const server = new ApolloServer({
      resolvers: this.compiler.generateResolvers(),
      typeDefs: this.compiler.generateType(),
      //   context: loginController.validation.bind(loginController),
      introspection: Recife.GRAPHQL_INTROSPECT,
      playground: Recife.GRAPHQL_PLAYGROUND
    });

    this.app.use(this.createBodyParser());

    // app.route('/login').post(loginController.login.bind(loginController));
    // app.route('/signup').post(loginController.signup.bind(loginController));

    server.applyMiddleware({ app: this.app });

    const port = Recife.NODE_PORT;
    this.app.listen({ port }, () => {
      console.log(
        `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
      );
    });
  }

  createBodyParser(): Koa.Middleware {
    const bodyParserConfig = require(path.join(
      Recife.PATH_BUILD,
      'config/bodyParser.js'
    )).default;

    return koaBody({
      enableTypes: bodyParserConfig.enableTypes || ['json', 'form'],
      encode: bodyParserConfig.encode || 'utf-8',
      formLimit: bodyParserConfig.limit.form || '56kb',
      jsonLimit: bodyParserConfig.limit.json || '1mb',
      textLimit: bodyParserConfig.limit.form || '1mb',
      strict: bodyParserConfig.strict || true,
      detectJSON: bodyParserConfig.detectJSON || null,
      extendTypes: bodyParserConfig.extendTypes || null,
      onerror: bodyParserConfig.onerror || null
    });
  }
}

export default Start;
