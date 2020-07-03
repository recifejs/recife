import fs from 'fs';
import { GraphQLScalarType } from 'graphql';
import Graph from './token/Graph';
import Field from './token/Field';
import Type from './token/Type';
import Scalar from './token/Scalar';

import Recife from '../Recife';
import DateScalar from '../scalars/DateScalar';
import ScalarType from '../types/ScalarType';
import requireUncached from '../helpers/requireUncached';
import capitalize from '../helpers/capitalize';

class Resolvers {
  private Query: any = {};
  private Mutation: any = {};
  private Subscription: any = {};
  private scalars: any = {};
  private resolversType: any = {};

  constructor() {
    this.scalars.Date = new GraphQLScalarType(DateScalar);
  }

  add(field: Field, type: Type) {
    const Model = this.getModel(type);
    const nameType = type.options.name || type.name;

    if (!this.resolversType[nameType]) {
      this.resolversType[nameType] = {};
    }

    this.resolversType[nameType] = {
      [field.name]: (...params: any[]) => {
        return Model[`get${capitalize(field.type)}`](...params);
      }
    };
  }

  addQuery(graph: Graph) {
    const name = graph.options.name || graph.name;
    this.Query[name] = (obj: any, args: any, context: any, info: any) =>
      this.createResolver(graph, args, { obj, context, info });
  }

  addMutation(graph: Graph) {
    const name = graph.options.name || graph.name;
    this.Mutation[name] = (obj: any, args: any, context: any, info: any) =>
      this.createResolver(graph, args, { obj, context, info });
  }

  addSubscription(graph: Graph) {
    const name = graph.options.name || graph.name;
    this.Subscription[name] = (obj: any, args: any, context: any, info: any) =>
      this.createResolver(graph, args, { obj, context, info });
  }

  addScalar(scalar: Scalar) {
    const scalarObject: ScalarType = this.getScalar(scalar);
    this.scalars[scalarObject.name] = new GraphQLScalarType({
      name: scalarObject.name,
      description: scalarObject.description,
      parseValue: scalarObject.parseValue,
      serialize: scalarObject.serialize,
      parseLiteral: scalarObject.parseLiteral
    });
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
      return controller[graph.name](args[graph.params.name], params);
    } else {
      return controller[graph.name](args, params);
    }
  }

  private getController(graph: Graph) {
    const file = requireUncached(graph.path.replace(Recife.PATH_BASE_ABSOLUTE, Recife.PATH_BUILD).replace('.ts', ''));

    const Controller = graph.isExportDefaultController ? file.default : file[graph.nameController];
    return Controller;
  }

  private getModel(type: Type) {
    const file = requireUncached(type.path.replace(Recife.PATH_BASE_ABSOLUTE, Recife.PATH_BUILD).replace('.ts', ''));
    const Model = type.isExportDefaultModel ? file.default : file[type.nameModel];
    return Model;
  }

  private getValidator(graph: Graph) {
    const nameValidator = graph.nameController.replace('Controller', 'Validator');
    const pathFile = graph.path
      .replace(Recife.PATH_BASE_ABSOLUTE, Recife.PATH_BUILD)
      .replace('controllers', 'validators')
      .replace('Controller', 'Validator')
      .replace('.ts', '.js');
    if (fs.existsSync(pathFile)) {
      const file = requireUncached(pathFile);
      const Validator = graph.isExportDefaultController ? file.default : file[nameValidator];

      if (Validator) {
        return Validator;
      }
    }

    return undefined;
  }

  private getScalar(scalar: Scalar) {
    const file = requireUncached(scalar.path.replace(Recife.PATH_BASE_ABSOLUTE, Recife.PATH_BUILD).replace('.ts', ''));
    const Model = scalar.isExportDefault ? file.default : file[scalar.name];
    return Model;
  }

  formatter(): any {
    const resolvers: any = this.resolversType;

    if (Object.keys(this.Query).length > 0) {
      resolvers.Query = this.Query;
    }

    if (Object.keys(this.Mutation).length > 0) {
      resolvers.Mutation = this.Mutation;
    }

    if (Object.keys(this.Subscription).length > 0) {
      resolvers.Subscription = this.Subscription;
    }

    return { ...resolvers, ...this.scalars };
  }
}

export default Resolvers;
