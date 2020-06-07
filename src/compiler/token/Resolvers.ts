import path from 'path';
import Graph from './Graph';
import Recife from '../../Recife';

class Resolvers {
  private Query: any = {};
  private Mutation: any = {};
  private Subscription: any = {};

  addQuery(graph: Graph) {
    this.Query[graph.name] = async (
      obj: any,
      args: any,
      context: any,
      info: any
    ) => {
      const Controller = this.getController(graph);
      const controller = new Controller();
      return controller[graph.name].result(args, { obj, context, info });
    };
  }

  addMutation(graph: Graph) {
    this.Mutation[graph.name] = async (
      obj: any,
      args: any,
      context: any,
      info: any
    ) => {
      const Controller = this.getController(graph);
      const controller = new Controller();
      return controller[graph.name].result(args, { obj, context, info });
    };
  }

  addSubscription(graph: Graph) {
    this.Subscription[graph.name] = async (
      obj: any,
      args: any,
      context: any,
      info: any
    ) => {
      const Controller = this.getController(graph);
      const controller = new Controller();
      return controller[graph.name].result(args, { obj, context, info });
    };
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
