declare module 'recife/scripts/build' {
  export {};

}
declare module 'recife/scripts/index' {
  export {};

}
declare module 'recife/scripts/server' {
  export {};

}
declare module 'recife/scripts/start' {
  export {};

}
declare module 'recife/src/Build' {
  class Server {
      run(): void;
  }
  export default Server;

}
declare module 'recife/src/Config' {
  import CorsConfig from 'recife/src/configs/CorsConfig';
  import MiddlewareConfig from 'recife/src/configs/MiddlewareConfig';
  class Config {
      private static _instance;
      private constructor();
      static get Instance(): Config;
      getBodyParser(): {
          enableTypes: string[] | undefined;
          encode: string | undefined;
          formLimit: string | undefined;
          jsonLimit: string | undefined;
          textLimit: string | undefined;
          strict: boolean | undefined;
          extendTypes: {
              json?: string[] | undefined;
              form?: string[] | undefined;
              text?: string[] | undefined;
          } | undefined;
      };
      createGraphlConfig(): {
          playground: import("apollo-server-core").PlaygroundConfig;
          introspection: boolean;
          debug: boolean;
          mocks: boolean;
          mockEntireSchema: boolean;
          rootValue: any;
      };
      getCorsConfig(): CorsConfig;
      getMidddlewareConfig(): MiddlewareConfig;
      readConfigBase(): void;
      private readConfigFile;
  }
  export default Config;

}
declare module 'recife/src/Program' {
  /// <reference types="node" />
  import { Server } from 'http';
  import Compiler from 'recife/src/compiler/index';
  import Config from 'recife/src/Config';
  import IServer from 'recife/src/interfaces/IServer';
  class Program {
      compiler: Compiler;
      app: any;
      config: Config;
      server?: Server;
      port: Number;
      lifecycle?: IServer;
      lastUpdatedLifecycle?: Date;
      constructor();
      start(): void;
      runContext(request: any): Promise<any>;
      private getLifecycle;
      private getHttpFramework;
  }
  export default Program;

}
declare module 'recife/src/Recife' {
  import AppConfig from 'recife/src/configs/AppConfig';
  import MiddlewareConfig from 'recife/src/configs/MiddlewareConfig';
  class Recife {
      static APP_NAME: string;
      static PATH_BASE: string;
      static PATH_BASE_ABSOLUTE: string;
      static PATH_BUILD: string;
      static PATH_CONTROLLERS: string;
      static PATH_MODELS: string;
      static PATH_SCALARS: string;
      static NODE_PORT: number;
      static NODE_HOST: string;
      static PACKAGE_JSON: any;
      static MIDDLEWARES: MiddlewareConfig;
      static HTTP_FRAMEWORK: string;
      constructor(config: AppConfig);
      private readTsconfig;
      private readPackageJson;
  }
  export default Recife;

}
declare module 'recife/src/Server' {
  import Program from 'recife/src/Program';
  class Server extends Program {
      run(): void;
  }
  export default Server;

}
declare module 'recife/src/Start' {
  import Program from 'recife/src/Program';
  class Start extends Program {
      run(): void;
  }
  export default Start;

}
declare module 'recife/src/compiler/Compiler' {
  import * as ts from 'typescript';
  import { DocumentNode } from 'graphql';
  class Compiler {
      private pathControllers;
      private pathModels;
      private pathScalars;
      constructor(pathControllers: string, pathModels: string, pathScalars: string);
      compile(): Promise<void>;
      clean(): void;
      createGraphs(files: string[], program: ts.Program): Promise<void>;
      createTypes(files: string[], program: ts.Program): Promise<void>;
      createScalar(files: string[], program: ts.Program): Promise<void>;
      generateType(): DocumentNode;
      generateResolvers(): any;
  }
  export default Compiler;

}
declare module 'recife/src/compiler/GraphCompiler' {
  import * as ts from 'typescript';
  import Graph from 'recife/src/compiler/token/Graph';
  class GraphCompiler {
      private static _instance;
      private graphs;
      private path;
      private program?;
      private constructor();
      static get Instance(): GraphCompiler;
      getGraphs(): Graph[];
      clean(): void;
      compile(path: string, program: ts.Program): void;
      private getFolder;
      private compileGraphs;
      private createInput;
      expand(): void;
      toStringType(): string;
  }
  export default GraphCompiler;

}
declare module 'recife/src/compiler/InputCompiler' {
  import * as ts from 'typescript';
  import ImportDeclaration from 'recife/src/compiler/token/ImportDeclaration';
  import Input from 'recife/src/compiler/token/Input';
  import NameImportType from 'recife/src/compiler/type/NameImportType';
  class InputCompiler {
      private static _instance;
      private inputs;
      private constructor();
      static get Instance(): InputCompiler;
      getInputs(): Input[];
      clean(): void;
      compile(importDeclaration: ImportDeclaration, program: ts.Program, nameImport: NameImportType): Input;
      compileObjectLiteral(node: ts.TypeLiteralNode, fieldName: string, path: string, sourceFile?: ts.SourceFile): Input;
      compileNode(node: ts.Node, path: string, sourceFile: ts.SourceFile): Input;
      private addInput;
      private findInput;
      private findInputName;
      expand(): void;
      toStringType(): string;
  }
  export default InputCompiler;

}
declare module 'recife/src/compiler/Resolvers' {
  import Graph from 'recife/src/compiler/token/Graph';
  import Field from 'recife/src/compiler/token/Field';
  import Type from 'recife/src/compiler/token/Type';
  import Scalar from 'recife/src/compiler/token/Scalar';
  class Resolvers {
      private Query;
      private Mutation;
      private Subscription;
      private scalars;
      private resolversType;
      constructor();
      add(field: Field, type: Type): void;
      addQuery(graph: Graph): void;
      addMutation(graph: Graph): void;
      addSubscription(graph: Graph): void;
      addScalar(scalar: Scalar): void;
      private createResolver;
      private getController;
      private getModel;
      private getValidator;
      private getScalar;
      formatter(): any;
  }
  export default Resolvers;

}
declare module 'recife/src/compiler/ScalarCompiler' {
  import * as ts from 'typescript';
  import Scalar from 'recife/src/compiler/token/Scalar';
  class ScalarCompiler {
      private static _instance;
      private sourceFile;
      private path;
      private scalarIntern;
      private scalars;
      private scalarsName;
      constructor();
      static get Instance(): ScalarCompiler;
      getScalars(): Scalar[];
      getNameScalars(): string[];
      clean(): void;
      compile(path: string, program: ts.Program): void;
      private isScalarType;
      toStringType(): string;
  }
  export default ScalarCompiler;

}
declare module 'recife/src/compiler/TypeCompiler' {
  import * as ts from 'typescript';
  import Type from 'recife/src/compiler/token/Type';
  class TypeCompiler {
      private static _instance;
      private types;
      private imports;
      private sourceFile;
      private path;
      constructor();
      static get Instance(): TypeCompiler;
      getTypes(): Type[];
      clean(): void;
      compile(path: string, program: ts.Program): void;
      compileObjectLiteral(node: ts.TypeLiteralNode, fieldName: string, path: string): Type;
      private getFolder;
      private isType;
      expand(): void;
      toStringType(): string;
  }
  export default TypeCompiler;

}
declare module 'recife/src/compiler/enum/FieldTypeEnum' {
  enum FieldTypeEnum {
      TYPE = "Type",
      INPUT = "Input"
  }
  export default FieldTypeEnum;

}
declare module 'recife/src/compiler/enum/GraphTypeEnum' {
  enum GraphTypeEnum {
      QUERY = "Query",
      MUTATION = "Mutation",
      SUBSCRIPTION = "Subscription"
  }
  export default GraphTypeEnum;

}
declare module 'recife/src/compiler/index' {
  export { default } from "recife/src/compiler/Compiler";

}
declare module 'recife/src/compiler/token/Field' {
  import * as ts from 'typescript';
  import FieldTypeEnum from 'recife/src/compiler/enum/FieldTypeEnum';
  import ImportDeclaration from 'recife/src/compiler/token/ImportDeclaration';
  import Type from 'recife/src/compiler/token/Type';
  import Input from 'recife/src/compiler/token/Input';
  class Field {
      name: string;
      type: string;
      isRequired: boolean;
      isArray: boolean;
      visible: boolean;
      importDeclaration?: ImportDeclaration;
      private node;
      private sourceFile?;
      private path;
      private parentName;
      constructor(node: ts.PropertyDeclaration | ts.PropertySignature, path: string, parentName: string, imports: ImportDeclaration[], fieldType: FieldTypeEnum, sourceFile?: ts.SourceFile);
      private readType;
      private findTypeDecorator;
      verifyAndUpdateType(scalars: string[], types: Type[], inputs: Input[]): void;
      toStringType(): string;
  }
  export default Field;

}
declare module 'recife/src/compiler/token/Graph' {
  import * as ts from 'typescript';
  import GraphParam from 'recife/src/compiler/token/GraphParam';
  import Type from 'recife/src/compiler/token/Type';
  import GraphTypeEnum from 'recife/src/compiler/enum/GraphTypeEnum';
  import SchemaOptions from 'recife/src/types/SchemaOptions';
  class Graph {
      name: string;
      type: GraphTypeEnum;
      params: GraphParam;
      isExportDefaultController: boolean;
      return: {
          type?: string;
          isRequired: boolean;
          isArray: boolean;
      };
      nameController: string;
      path: string;
      options: SchemaOptions;
      private node;
      private sourceFile?;
      constructor(method: ts.MethodDeclaration, classDecl: ts.ClassDeclaration, path: string, isDefaultExternal: boolean, sourceFile?: ts.SourceFile);
      getName(): string;
      private readReturn;
      verifyAndUpdateType(scalars: string[], types: Type[]): void;
      toStringType(): string;
  }
  export default Graph;

}
declare module 'recife/src/compiler/token/GraphParam' {
  import * as ts from 'typescript';
  class GraphParam {
      name: string;
      type: string;
      isRequired: boolean;
      constructor(parameter: ts.ParameterDeclaration, path: string, nameGraph: string, sourceFile?: ts.SourceFile);
      static isParamValid(parameter: ts.ParameterDeclaration, sourceFile?: ts.SourceFile): boolean;
  }
  export default GraphParam;

}
declare module 'recife/src/compiler/token/ImportDeclaration' {
  import * as ts from 'typescript';
  import NameImportType from 'recife/src/compiler/type/NameImportType';
  class ImportDeclaration {
      names: NameImportType[];
      path: string;
      pathImport: string;
      constructor(node: ts.ImportDeclaration, pathImport: string, sourceFile?: ts.SourceFile);
      getPath(): string;
  }
  export default ImportDeclaration;

}
declare module 'recife/src/compiler/token/Input' {
  import * as ts from 'typescript';
  import Field from 'recife/src/compiler/token/Field';
  class Input {
      name: string;
      fields: Field[];
      path: string;
      sourceFile?: ts.SourceFile;
      node: ts.Node;
      constructor(node: ts.Node, path: string, sourceFile?: ts.SourceFile, fieldName?: string);
      toStringType(): string;
      private compileTypeLiteral;
      private compileClassAndInterface;
      private compileObject;
      private compileField;
  }
  export default Input;

}
declare module 'recife/src/compiler/token/Scalar' {
  import * as ts from 'typescript';
  class Scalar {
      name: string;
      isExportDefault: boolean;
      path: string;
      constructor(node: ts.VariableDeclaration, nodeStatement: ts.VariableStatement, path: string, isDefaultExternal: boolean, sourceFile?: ts.SourceFile);
      getNameScalar(): string;
      toStringType(): string;
  }
  export default Scalar;

}
declare module 'recife/src/compiler/token/Type' {
  import * as ts from 'typescript';
  import Field from 'recife/src/compiler/token/Field';
  import TypeOptions from 'recife/src/types/TypeOptions';
  import ImportDeclaration from 'recife/src/compiler/token/ImportDeclaration';
  class Type {
      name: string;
      fields: Field[];
      isExportDefaultModel: boolean;
      path: string;
      nameModel: string;
      heritageName?: string;
      heritageType?: Type;
      options: TypeOptions;
      constructor(node: ts.ClassDeclaration | ts.TypeLiteralNode, path: string, isDefaultExternal: boolean, imports: ImportDeclaration[], sourceFile?: ts.SourceFile, name?: string);
      private getOptions;
      setHeritageType(heritageType: Type): void;
      toStringType(): string;
  }
  export default Type;

}
declare module 'recife/src/compiler/type/NameImportType' {
  type NameImportType = {
      name: string;
      nameAlias?: string;
      exportDefault: boolean;
  };
  export default NameImportType;

}
declare module 'recife/src/configs/AppConfig' {
  type AppConfig = {
      appName: string;
      basePath: string;
      port: number;
      host: string;
      httpFramework: string;
  };
  export default AppConfig;

}
declare module 'recife/src/configs/BodyParserConfig' {
  type BodyParserConfig = {
      enableTypes?: string[];
      encode?: string;
      limit: {
          form?: string;
          json?: string;
          text?: string;
      };
      strict?: boolean;
      extendTypes?: {
          json?: string[];
          form?: string[];
          text?: string[];
      };
  };
  export default BodyParserConfig;

}
declare module 'recife/src/configs/CorsConfig' {
  type CorsConfig = {
      enabled: boolean;
      origin?: string;
      allowMethods?: string[] | string;
      exposeHeaders?: string[] | string;
      allowHeaders?: string[] | string;
      maxAge?: number | string;
      credentials?: boolean;
      keepHeadersOnError?: boolean;
  };
  export default CorsConfig;

}
declare module 'recife/src/configs/GraphqlConfig' {
  import { PlaygroundConfig } from 'apollo-server-core';
  type GraphqlConfig = {
      playground: PlaygroundConfig;
      introspection: boolean;
      debug: boolean;
      mocks: boolean;
      mockEntireSchema: boolean;
      rootValue: any;
  };
  export default GraphqlConfig;

}
declare module 'recife/src/configs/MiddlewareConfig' {
  type MiddlewareConfig = {
      middlewares: Record<string, string>;
      global: Record<string, string>;
  };
  export default MiddlewareConfig;

}
declare module 'recife/src/decorators/Field' {
  import FieldOptions from 'recife/src/types/FieldOptions';
  function Field(options: string | FieldOptions): any;
  export default Field;

}
declare module 'recife/src/decorators/Mutation' {
  import SchemaOptions from 'recife/src/types/SchemaOptions';
  function Mutation(options?: SchemaOptions): any;
  export default Mutation;

}
declare module 'recife/src/decorators/Query' {
  import SchemaOptions from 'recife/src/types/SchemaOptions';
  function Query(options?: SchemaOptions): any;
  export default Query;

}
declare module 'recife/src/decorators/Subscription' {
  import SchemaOptions from 'recife/src/types/SchemaOptions';
  function Subscription(options?: SchemaOptions): any;
  export default Subscription;

}
declare module 'recife/src/decorators/Type' {
  import TypeOptions from 'recife/src/types/TypeOptions';
  function Type(_options?: TypeOptions): any;
  export default Type;

}
declare module 'recife/src/decorators/execMiddlewares' {
  const execMiddlewares: (middlewares?: string[] | undefined, optionsSchema?: any) => Promise<any>;
  export default execMiddlewares;

}
declare module 'recife/src/helpers/capitalize' {
  const capitalize: (string: string) => string;
  export default capitalize;

}
declare module 'recife/src/helpers/createDecoratorOptions' {
  import * as ts from 'typescript';
  const createDecoratorOptions: (expression: ts.ObjectLiteralExpression, sourceFile?: ts.SourceFile | undefined) => any;
  export default createDecoratorOptions;

}
declare module 'recife/src/helpers/exportHelper' {
  import * as ts from 'typescript';
  export const isExportDefault: (node: ts.Node) => boolean;
  export const isExport: (node: ts.Node) => boolean;
  export const getNameExportDefault: (sourceFile: ts.SourceFile) => string | undefined;
  export const findNodeExportDefault: (sourceFile: ts.SourceFile) => ts.Node | undefined;

}
declare module 'recife/src/helpers/getMiddleware' {
  const getMiddleware: (pathMiddleware: string) => any;
  export default getMiddleware;

}
declare module 'recife/src/helpers/primitiveHelper' {
  import * as ts from 'typescript';
  export const formatPrimitiveString: (type?: string) => string;
  export const formatPrimitive: (type: ts.Node) => string;

}
declare module 'recife/src/helpers/readAllFiles' {
  const readAllFiles: (basePath: string) => Promise<string[]>;
  export default readAllFiles;

}
declare module 'recife/src/helpers/referenceHelper' {
  import * as ts from 'typescript';
  export const getReference: (name: string, sourceFile: ts.SourceFile) => ts.Node | undefined;

}
declare module 'recife/src/helpers/requireUncached' {
  const requireUncached: (module: string) => any;
  export default requireUncached;

}
declare module 'recife/src/index' {
  export { default as Query } from 'recife/src/decorators/Query';
  export { default as Mutation } from 'recife/src/decorators/Mutation';
  export { default as Subscription } from 'recife/src/decorators/Subscription';
  export { default as Type } from 'recife/src/decorators/Type';
  export { default as Field } from 'recife/src/decorators/Field';
  export { default as BodyParserConfig } from 'recife/src/configs/BodyParserConfig';
  export { default as GraphqlConfig } from 'recife/src/configs/GraphqlConfig';
  export { default as CorsConfig } from 'recife/src/configs/CorsConfig';
  export { default as AppConfig } from 'recife/src/configs/AppConfig';
  export { default as MiddlewareConfig } from 'recife/src/configs/MiddlewareConfig';
  export { default as ScalarType } from 'recife/src/types/ScalarType';
  export { MiddlewareGlobalType, MiddlewareType } from 'recife/src/types/MiddlewareResultType';
  export { default as SchemaOptions } from 'recife/src/types/SchemaOptions';
  export { default as TypeOptions } from 'recife/src/types/TypeOptions';
  export { default as IServer } from 'recife/src/interfaces/IServer';

}
declare module 'recife/src/interfaces/IServer' {
  interface IServer {
      beforeStarted(): void;
      started(): void;
      beforeMounted(): void;
      mounted(): void;
      beforeUpdated(): void;
      updated(): void;
      catch(error: any): void;
  }
  export default IServer;

}
declare module 'recife/src/log/Log' {
  import LogType from 'recife/src/log/LogType';
  class Log {
      private static _instance;
      private errors;
      private warns;
      private infoOld;
      private colors;
      private constructor();
      static get Instance(): Log;
      clean(): void;
      infoHeap(text: string): void;
      successHeap(text: string): void;
      jump(): void;
      title(text: string): void;
      info(text: string): void;
      error(log: LogType): void;
      exception(text: string): void;
      warn(log: LogType): void;
      containsErrors(): boolean;
      containsWarns(): boolean;
      showErrors(text: string): void;
  }
  export default Log;

}
declare module 'recife/src/log/LogType' {
  import * as ts from 'typescript';
  type LogType = {
      code: string;
      message: string;
      path: string;
      line?: ts.LineAndCharacter;
      node?: ts.Node;
      sourceFile?: ts.SourceFile;
  };
  export default LogType;

}
declare module 'recife/src/log/index' {
  export { default } from 'recife/src/log/Log';

}
declare module 'recife/src/scalars/DateScalar' {
  import ScalarType from 'recife/src/types/ScalarType';
  const DateScalar: ScalarType;
  export default DateScalar;

}
declare module 'recife/src/templates/generateHomepage' {
  const generateHomepage: (application: string, version: string) => string;
  export default generateHomepage;

}
declare module 'recife/src/types/FieldOptions' {
  type FieldOptions = {
      type?: string;
      visible?: boolean;
  };
  export default FieldOptions;

}
declare module 'recife/src/types/MiddlewareResultType' {
  export type MiddlewareGlobalType = {
      request: {
          method: string;
          url: string;
          header: any;
      };
  };
  export type MiddlewareType = {
      parent?: any;
      args?: any;
      context?: any;
      info?: any;
  };

}
declare module 'recife/src/types/ScalarType' {
  import { GraphQLScalarSerializer, GraphQLScalarValueParser, GraphQLScalarLiteralParser } from 'graphql';
  type ScalarType = {
      name: string;
      description?: string;
      serialize: GraphQLScalarSerializer<any>;
      parseValue: GraphQLScalarValueParser<any>;
      parseLiteral: GraphQLScalarLiteralParser<any>;
  };
  export default ScalarType;

}
declare module 'recife/src/types/SchemaOptions' {
  type SchemaOptions = {
      name?: string;
      middlewares?: string[];
  };
  export default SchemaOptions;

}
declare module 'recife/src/types/TypeOptions' {
  type TypeOptions = {
      name?: string;
      onlyHeritage?: boolean;
  };
  export default TypeOptions;

}
declare module 'recife' {
  import main = require('recife/index');
  export = main;
}