'use strict';

import Compiler from '../src/compiler';
import Recife from '../src/Recife';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';

const compiler = new Compiler();
compiler.compile();
const app = express();

const server = new ApolloServer({
  resolvers: compiler.generateResolvers(),
  typeDefs: compiler.generateType(),
  //   context: loginController.validation.bind(loginController),
  introspection: Recife.GRAPHQL_INTROSPECT,
  playground: Recife.GRAPHQL_PLAYGROUND
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// app.route('/login').post(loginController.login.bind(loginController));
// app.route('/signup').post(loginController.signup.bind(loginController));

server.applyMiddleware({ app });

const port = Recife.NODE_PORT;

app.listen({ port }, () => {
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  );
});
