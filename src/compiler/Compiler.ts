import fs from 'fs';
import path from 'path';
import { gql } from 'apollo-server-koa';
import { DocumentNode } from 'graphql';

import Graph from './token/Graph';
import Resolvers from './Resolvers';
import Type from './token/Type';
import Input from './token/Input';
import GraphTypeEnum from './enum/GraphTypeEnum';
import GraphCompiler from './GraphCompiler';
import TypeCompiler from './TypeCompiler';
import Recife from '../Recife';

class Compiler {
  private graphs: Graph[] = [];
  private types: Type[] = [];
  private inputs: Input[] = [];
  private scalars: String[] = ['Date'];

  compile() {
    const filesController: string[] = fs.readdirSync(Recife.PATH_CONTROLLERS);
    filesController.forEach(file => {
      const nameFileAbsolute = path.join(Recife.PATH_CONTROLLERS, file);

      const graphCompiler = new GraphCompiler(nameFileAbsolute);
      graphCompiler.compile();
      this.graphs = this.graphs.concat(graphCompiler.getGraphs());
      this.inputs = this.inputs.concat(graphCompiler.getInputs());
    });

    const filesModel: string[] = fs.readdirSync(Recife.PATH_MODELS);
    filesModel.forEach(file => {
      const nameFileAbsolute = path.join(Recife.PATH_MODELS, file);

      const typeCompiler = new TypeCompiler(nameFileAbsolute);
      typeCompiler.compile();
      this.types = this.types.concat(typeCompiler.getTypes());
    });
  }

  clean() {
    this.graphs = [];
    this.types = [];
    this.inputs = [];
    this.scalars = ['Date'];
  }

  generateType(): DocumentNode {
    let typeString = '';

    this.scalars.forEach(scalar => {
      typeString += `scalar ${scalar}\n`;
    });

    this.types.forEach(type => {
      typeString += `type ${type.name} {\n`;

      type.fields.forEach(field => {
        typeString += `  ${field.name}: ${field.type} \n`;
      });

      typeString += '}\n';
    });

    this.inputs.forEach(input => {
      typeString += `input ${input.name} {\n`;

      input.fields.forEach(field => {
        const required = field.isRequired ? '!' : '';
        typeString += `  ${field.name}: ${field.type}${required} \n`;
      });

      typeString += '}\n';
    });

    typeString += this.generateTypeGraph(GraphTypeEnum.QUERY);
    typeString += this.generateTypeGraph(GraphTypeEnum.MUTATION);
    typeString += this.generateTypeGraph(GraphTypeEnum.SUBSCRIPTION);

    return gql(typeString);
  }

  private generateTypeGraph(graphType: GraphTypeEnum): string {
    let typeString = '';

    this.graphs.forEach(graph => {
      if (graph.type === graphType) {
        if (graph.params) {
          const required = graph.params.isRequired ? '!' : '';
          typeString += `  ${graph.name}(${graph.params.name}: ${graph.params.type}${required}): ${graph.returnType}\n`;
        } else {
          typeString += `  ${graph.name}: ${graph.returnType}\n`;
        }
      }
    });

    if (typeString) {
      return `type ${graphType.toString()} {\n${typeString}}\n`;
    }

    return '';
  }

  generateResolvers(): any {
    let resolvers = new Resolvers();
    const listScalars: String[] = ['Int', 'Float', 'String', 'Boolean', 'ID', ...this.scalars];

    this.types.forEach(type => {
      type.fields.forEach(field => {
        if (!listScalars.includes(field.type)) {
          resolvers.add(field, type);
        }
      });
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
