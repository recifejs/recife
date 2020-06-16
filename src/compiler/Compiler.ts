import * as ts from 'typescript';
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

  async compile() {
    const filesModel: string[] = fs.readdirSync(this.pathModels).map(file => path.join(this.pathModels, file));
    const filesController: string[] = fs
      .readdirSync(this.pathControllers)
      .map(file => path.join(this.pathControllers, file));
    const filesScalar: string[] = fs.readdirSync(this.pathScalars).map(file => path.join(this.pathScalars, file));

    const program = ts.createProgram([...filesModel, ...filesController, ...filesScalar], { allowJs: true });

    let promises: Promise<any>[] = [];
    promises.push(this.createGraphs(filesController, program));
    promises.push(this.createTypes(filesModel, program));
    promises.push(this.createScalar(filesScalar, program));
    await Promise.all(promises);
  }

  clean() {
    this.graphs = [];
    this.types = [];
    this.inputs = [];
    this.scalarIntern = ['Date'];
    this.scalars = [];
  }

  async createGraphs(files: string[], program: ts.Program) {
    let promises: Promise<any>[] = [];

    files.forEach(file => {
      promises.push(
        new Promise(resolve => {
          const graphCompiler = new GraphCompiler(file, program, this.pathControllers);
          graphCompiler.compile();
          this.graphs = this.graphs.concat(graphCompiler.getGraphs());
          this.inputs = this.inputs.concat(graphCompiler.getInputs());

          resolve();
        })
      );
    });

    await Promise.all(promises);
  }

  async createTypes(files: string[], program: ts.Program) {
    if (fs.existsSync(this.pathModels)) {
      let promises: Promise<any>[] = [];
      files.forEach(file => {
        promises.push(
          new Promise(resolve => {
            const typeCompiler = new TypeCompiler(file, program);
            typeCompiler.compile();
            this.types = this.types.concat(typeCompiler.getTypes());

            resolve();
          })
        );
      });

      await Promise.all(promises);
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
  }

  async createScalar(files: string[], program: ts.Program) {
    if (fs.existsSync(this.pathScalars)) {
      let promises: Promise<any>[] = [];
      files.forEach(file => {
        promises.push(
          new Promise(resolve => {
            const scalarCompiler = new ScalarCompiler(file, program);
            scalarCompiler.compile();
            this.scalars = this.scalars.concat(scalarCompiler.getScalars());

            resolve();
          })
        );
      });

      await Promise.all(promises);
    }
  }

  generateType(): DocumentNode {
    let typeString = '';

    this.scalarIntern.forEach(scalar => {
      typeString += `scalar ${scalar}\n`;
    });

    this.scalars.forEach(scalar => (typeString += scalar.toStringType()));
    this.types.forEach(type => (typeString += type.toStringType()));
    this.inputs.forEach(input => (typeString += input.toStringType()));

    this.graphs.forEach(graph => {
      typeString += graph.toStringType();
    });

    typeString = typeString.includes('type Subscription') ? `type Subscription\n${typeString}` : typeString;
    typeString = typeString.includes('type Mutation') ? `type Mutation\n${typeString}` : typeString;
    typeString = typeString.includes('type Query') ? `type Query\n${typeString}` : typeString;

    return gql(typeString);
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
