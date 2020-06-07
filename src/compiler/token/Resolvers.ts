import Graph from './Graph';
import fs from 'fs';
import Recife from '../../Recife';

class Resolvers {
  private Query: any = {};
  private Mutation: any = {};
  private Subscription: any = {};

  addQuery(graph: Graph) {
    this.Query[graph.name] = (obj: any, args: any, context: any, info: any) =>
      this.createResolver(graph, args, { obj, context, info });
  }

  addMutation(graph: Graph) {
    this.Mutation[graph.name] = (
      obj: any,
      args: any,
      context: any,
      info: any
    ) => this.createResolver(graph, args, { obj, context, info });
  }

  addSubscription(graph: Graph) {
    this.Subscription[graph.name] = (
      obj: any,
      args: any,
      context: any,
      info: any
    ) => this.createResolver(graph, args, { obj, context, info });
  }

  private async createResolver(graph: Graph, args: any, params: any) {
    const Controller = this.getController(graph);
    const Validator = this.getValidator(graph);

    if (Validator) {
      const validator = new Validator();
      if (validator[graph.name]) {
        return validator[graph.name](args, params);
      }
    }

    const controller = new Controller();
    return controller[graph.name].result(args, params);
  }

  private getController(graph: Graph) {
    const file = require(graph.path
      .replace(Recife.PATH_BASE_ABSOLUTE, Recife.PATH_BUILD)
      .replace('.ts', '.js'));

    const Controller = graph.isExportDefaultController
      ? file.default
      : file[graph.nameController];

    return Controller;
  }

  private getValidator(graph: Graph) {
    const nameValidator = graph.nameController.replace(
      'Controller',
      'Validator'
    );
    const pathFile = graph.path
      .replace(Recife.PATH_BASE_ABSOLUTE, Recife.PATH_BUILD)
      .replace('controllers', 'validators')
      .replace('Controller', 'Validator')
      .replace('.ts', '.js');
    if (fs.existsSync(pathFile)) {
      const file = require(pathFile);
      const Validator = graph.isExportDefaultController
        ? file.default
        : file[nameValidator];

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

    return resolvers;
  }
}

export default Resolvers;
