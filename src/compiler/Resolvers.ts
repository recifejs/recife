import fs from 'fs';
import { GraphQLScalarType } from 'graphql';
import Recife from '../Recife';
import Graph from './token/Graph';
import DateScalar from '../scalars/DateScalar';

class Resolvers {
  private scalars: Map<string, GraphQLScalarType>;
  private Query: any = {};
  private Mutation: any = {};
  private Subscription: any = {};

  constructor() {
    this.scalars = new Map();
    this.scalars.set('Date', new DateScalar());
  }

  addQuery(graph: Graph) {
    this.Query[graph.name] = (obj: any, args: any, context: any, info: any) =>
      this.createResolver(graph, args, { obj, context, info });
  }

  addMutation(graph: Graph) {
    this.Mutation[graph.name] = (obj: any, args: any, context: any, info: any) =>
      this.createResolver(graph, args, { obj, context, info });
  }

  addSubscription(graph: Graph) {
    this.Subscription[graph.name] = (obj: any, args: any, context: any, info: any) =>
      this.createResolver(graph, args, { obj, context, info });
  }

  private async createResolver(graph: Graph, args: any, params: any) {
    const Controller = this.getController(graph);
    const Validator = this.getValidator(graph);

    if (Validator) {
      const validator = new Validator();
      if (validator[graph.name]) {
        if (graph.params) {
          await validator[graph.name](args[graph.params.name], params);
        } else {
          await validator[graph.name](args, params);
        }
      }
    }

    const controller = new Controller();
    if (graph.params) {
      return controller[graph.name].result(args[graph.params.name], params);
    } else {
      return controller[graph.name].result(args, params);
    }
  }

  private getController(graph: Graph) {
    const file = require(graph.path.replace(Recife.PATH_BASE_ABSOLUTE, Recife.PATH_BUILD).replace('.ts', '.js'));

    const Controller = graph.isExportDefaultController ? file.default : file[graph.nameController];

    return Controller;
  }

  private getValidator(graph: Graph) {
    const nameValidator = graph.nameController.replace('Controller', 'Validator');
    const pathFile = graph.path
      .replace(Recife.PATH_BASE_ABSOLUTE, Recife.PATH_BUILD)
      .replace('controllers', 'validators')
      .replace('Controller', 'Validator')
      .replace('.ts', '.js');
    if (fs.existsSync(pathFile)) {
      const file = require(pathFile);
      const Validator = graph.isExportDefaultController ? file.default : file[nameValidator];

      if (Validator) {
        return Validator;
      }
    }

    return undefined;
  }

  formatter(): any {
    const resolvers: any = {};

    if (Object.keys(this.Query).length > 0) {
      resolvers.Query = this.Query;
    }

    if (Object.keys(this.Mutation).length > 0) {
      resolvers.Mutation = this.Mutation;
    }

    if (Object.keys(this.Subscription).length > 0) {
      resolvers.Subscription = this.Subscription;
    }

    this.scalars.forEach((value, key) => {
      resolvers[key] = value;
    });

    return resolvers;
  }
}

export default Resolvers;
