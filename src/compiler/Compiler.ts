import fs from 'fs';
import path from 'path';
import { gql } from 'apollo-server-koa';
import { DocumentNode } from 'graphql';

import GraphCompiler from './GraphCompiler';
import TypeCompiler from './TypeCompiler';
import ScalarCompiler from './ScalarCompiler';

import Graph from './token/Graph';
import Resolvers from './Resolvers';
import Type from './token/Type';
import Input from './token/Input';
import Scalar from './token/Scalar';

import GraphTypeEnum from './enum/GraphTypeEnum';

class Compiler {
  private graphs: Graph[] = [];
  private types: Type[] = [];
  private inputs: Input[] = [];
  private scalarIntern: string[] = ['Date'];
  private scalars: Scalar[] = [];
  private pathControllers: string;
  private pathModels: string;
  private pathScalars: string;

  constructor(pathControllers: string, pathModels: string, pathScalars: string) {
    this.pathControllers = pathControllers;
    this.pathModels = pathModels;
    this.pathScalars = pathScalars;
  }

  compile() {
    const filesController: string[] = fs.readdirSync(this.pathControllers);
    filesController.forEach(file => {
      const nameFileAbsolute = path.join(this.pathControllers, file);

      const graphCompiler = new GraphCompiler(nameFileAbsolute, this.pathControllers);
      graphCompiler.compile();
      this.graphs = this.graphs.concat(graphCompiler.getGraphs());
      this.inputs = this.inputs.concat(graphCompiler.getInputs());
    });

    if (fs.existsSync(this.pathModels)) {
      const filesModel: string[] = fs.readdirSync(this.pathModels);
      filesModel.forEach(file => {
        const nameFileAbsolute = path.join(this.pathModels, file);

        const typeCompiler = new TypeCompiler(nameFileAbsolute);
        typeCompiler.compile();
        this.types = this.types.concat(typeCompiler.getTypes());
      });
    }

    this.types = this.types.map(type => {
      if (type.heritageName) {
        const heritageType = this.types.find(item => item.name === type.heritageName);
        if (heritageType) {
          type.setHeritageType(heritageType);
        }
      }

      return type;
    });

    if (fs.existsSync(this.pathScalars)) {
      const filesScalar: string[] = fs.readdirSync(this.pathScalars);
      filesScalar.forEach(file => {
        const nameFileAbsolute = path.join(this.pathScalars, file);

        const scalarCompiler = new ScalarCompiler(nameFileAbsolute);
        scalarCompiler.compile();
        this.scalars = this.scalars.concat(scalarCompiler.getScalars());
      });
    }
  }

  clean() {
    this.graphs = [];
    this.types = [];
    this.inputs = [];
    this.scalarIntern = ['Date'];
    this.scalars = [];
  }

  generateType(): DocumentNode {
    let typeString = '';

    this.scalarIntern.forEach(scalar => {
      typeString += `scalar ${scalar}\n`;
    });

    this.scalars.forEach(scalar => (typeString += scalar.toStringType()));
    this.types.forEach(type => (typeString += type.toStringType()));
    this.inputs.forEach(input => (typeString += input.toStringType()));

    typeString += this.generateTypeGraph(GraphTypeEnum.QUERY);
    typeString += this.generateTypeGraph(GraphTypeEnum.MUTATION);
    typeString += this.generateTypeGraph(GraphTypeEnum.SUBSCRIPTION);

    return gql(typeString);
  }

  private generateTypeGraph(graphType: GraphTypeEnum): string {
    let typeString = '';

    this.graphs.forEach(graph => {
      if (graph.type === graphType) {
        typeString += graph.toStringType();
      }
    });

    if (typeString) {
      return `type ${graphType.toString()} {\n${typeString}}\n`;
    }

    return '';
  }

  generateResolvers(): any {
    let resolvers = new Resolvers();
    const listScalars: string[] = [
      'Int',
      'Float',
      'String',
      'Boolean',
      'ID',
      ...this.scalarIntern,
      ...this.scalars.map(item => item.name)
    ];

    this.types.forEach(type => {
      type.fields.forEach(field => {
        if (!listScalars.includes(field.type)) {
          resolvers.add(field, type);
        }
      });
    });

    this.scalars.forEach(scalar => {
      resolvers.addScalar(scalar);
    });

    this.graphs.forEach(graph => {
      if (graph.type === GraphTypeEnum.QUERY) {
        resolvers.addQuery(graph);
      } else if (graph.type === GraphTypeEnum.MUTATION) {
        resolvers.addMutation(graph);
      } else if (graph.type === GraphTypeEnum.SUBSCRIPTION) {
        resolvers.addSubscription(graph);
      }
    });

    return resolvers.formatter();
  }
}

export default Compiler;
