import * as ts from 'typescript';
import fs from 'fs';
import { gql } from 'apollo-server-core';
import { DocumentNode } from 'graphql';
import readAllFiles from '../helpers/readAllFiles';

import GraphCompiler from './GraphCompiler';
import TypeCompiler from './TypeCompiler';
import ScalarCompiler from './ScalarCompiler';

import Resolvers from './Resolvers';

import GraphTypeEnum from './enum/GraphTypeEnum';
import Log from '../log';
import InputCompiler from './InputCompiler';

class Compiler {
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
    promisesReadFile.push(readAllFiles(this.pathControllers));
    promisesReadFile.push(readAllFiles(this.pathModels));
    promisesReadFile.push(readAllFiles(this.pathScalars));
    const paths = await Promise.all(promisesReadFile);

    const program = ts.createProgram([...paths[0], ...paths[1], ...paths[2]], { allowJs: true });

    let promisesCreate: Promise<any>[] = [];
    promisesCreate.push(this.createGraphs(paths[0], program));
    promisesCreate.push(this.createTypes(paths[1], program));
    promisesCreate.push(this.createScalar(paths[2], program));
    await Promise.all(promisesCreate);

    GraphCompiler.Instance.expand();
    InputCompiler.Instance.expand();
    TypeCompiler.Instance.expand();

    if (Log.Instance.containsErrors()) {
      Log.Instance.showErrors('Error in compiled');
      throw new Error('Error in compiled');
    } else if (Log.Instance.containsWarns()) {
      Log.Instance.showErrors('Warnings in compiled');
    }
  }

  clean() {
    GraphCompiler.Instance.clean();
    InputCompiler.Instance.clean();
    TypeCompiler.Instance.clean();
    ScalarCompiler.Instance.clean();
  }

  async createGraphs(files: string[], program: ts.Program) {
    let promises: Promise<any>[] = [];

    files.forEach(file => {
      promises.push(
        new Promise(resolve => {
          GraphCompiler.Instance.compile(file, program);
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
            TypeCompiler.Instance.compile(file, program);
            resolve();
          })
        );
      });

      await Promise.all(promises);
    }
  }

  async createScalar(files: string[], program: ts.Program) {
    if (fs.existsSync(this.pathScalars)) {
      let promises: Promise<any>[] = [];
      files.forEach(file => {
        promises.push(
          new Promise(resolve => {
            ScalarCompiler.Instance.compile(file, program);
            resolve();
          })
        );
      });

      await Promise.all(promises);
    }
  }

  generateType(): DocumentNode {
    let typeString = '';

    typeString += ScalarCompiler.Instance.toStringType();
    typeString += TypeCompiler.Instance.toStringType();
    typeString += InputCompiler.Instance.toStringType();
    typeString += GraphCompiler.Instance.toStringType();

    typeString += `extend type Query {\n  recife: String!\n}\n`;

    typeString = typeString.includes('type Subscription') ? `type Subscription\n${typeString}` : typeString;
    typeString = typeString.includes('type Mutation') ? `type Mutation\n${typeString}` : typeString;
    typeString = typeString.includes('type Query') ? `type Query\n${typeString}` : typeString;

    return gql(typeString);
  }

  generateResolvers(): any {
    let resolvers = new Resolvers();
    const listNameScalars = ScalarCompiler.Instance.getNameScalars();

    TypeCompiler.Instance.getTypes().forEach(type => {
      type.fields.forEach(field => {
        if (field.visible && !listNameScalars.includes(field.type)) {
          resolvers.add(field, type);
        }
      });
    });

    ScalarCompiler.Instance.getScalars().forEach(scalar => resolvers.addScalar(scalar));

    GraphCompiler.Instance.getGraphs().forEach(graph => {
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
