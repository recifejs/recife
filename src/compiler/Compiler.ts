import * as ts from 'typescript';
import fs from 'fs';
import path from 'path';
import { gql } from 'apollo-server-core';
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
import Log from '../log';
import Recife from '../Recife';

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
    let promisesReadFile: Promise<string[]>[] = [];
    promisesReadFile.push(this.readFileFolderSync(this.pathControllers));
    promisesReadFile.push(this.readFileFolderSync(this.pathModels));
    promisesReadFile.push(this.readFileFolderSync(this.pathScalars));
    const paths = await Promise.all(promisesReadFile);

    const program = ts.createProgram([...paths[0], ...paths[1], ...paths[2]], { allowJs: true });

    let promisesCreate: Promise<any>[] = [];
    promisesCreate.push(this.createGraphs(paths[0], program));
    promisesCreate.push(this.createTypes(paths[1], program));
    promisesCreate.push(this.createScalar(paths[2], program));
    await Promise.all(promisesCreate);

    this.expandType();

    if (Log.Instance.containsErrors()) {
      Log.Instance.showErrors('Error in compiled');
      throw new Error('Error in compiled');
    }
  }

  readFileFolderSync(folder: string): Promise<string[]> {
    return new Promise(resolve => {
      fs.readdir(folder, (err, list) => {
        resolve(list ? list.map(file => path.join(folder, file)) : []);
      });
    });
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
            const typeCompiler = new TypeCompiler(file, program, Recife.PATH_MODELS);
            typeCompiler.compile();
            this.types = this.types.concat(typeCompiler.getTypes());

            resolve();
          })
        );
      });

      await Promise.all(promises);
    }
  }

  private expandType() {
    const scalars = this.listScalars();

    this.types = this.types.map(type => {
      if (type.heritageName) {
        const heritageType = this.types.find(item => item.name === type.heritageName);
        if (heritageType) {
          type.setHeritageType(heritageType);
        }
      }

      type.fields.forEach(field => field.verifyAndUpdateType(scalars, this.types));

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

  listScalars(): string[] {
    return ['Int', 'Float', 'String', 'Boolean', 'ID', ...this.scalarIntern, ...this.scalars.map(item => item.name)];
  }

  generateResolvers(): any {
    let resolvers = new Resolvers();
    const listScalars = this.listScalars();

    this.types.forEach(type => {
      type.fields.forEach(field => {
        if (field.visible && !listScalars.includes(field.type)) {
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
