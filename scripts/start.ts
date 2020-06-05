'use strict';

import Compiler from '../src/compiler';
import Recife from '../src/Recife';
import koa from 'koa';
import koaBody from 'koa-bodyparser';
import { ApolloServer } from 'apollo-server-koa';

const compiler = new Compiler();
compiler.compile();

const app = new koa();

const server = new ApolloServer({
  resolvers: compiler.generateResolvers(),
  typeDefs: compiler.generateType(),
  //   context: loginController.validation.bind(loginController),
  introspection: Recife.GRAPHQL_INTROSPECT,
  playground: Recife.GRAPHQL_PLAYGROUND
});

app.use(koaBody());

// app.route('/login').post(loginController.login.bind(loginController));
// app.route('/signup').post(loginController.signup.bind(loginController));

server.applyMiddleware({ app });
const port = Recife.NODE_PORT;

app.listen({ port }, () => {
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  );
});
