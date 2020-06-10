import ts, { ModuleKind } from 'typescript';
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import koaBody from 'koa-bodyparser';
import koaCors from '@koa/cors';

import BodyParserConfig from './configs/BodyParserConfig';
import GraphqlConfig from './configs/GraphqlConfig';
import CorsConfig from './configs/CorsConfig';
import AppConfig from './configs/AppConfig';
import Recife from './Recife';

class Config {
  createBodyParser() {
    const bodyParserConfig: BodyParserConfig = this.readConfigFile(path.join(process.cwd(), 'config/bodyParser.ts'));

    return koaBody({
      enableTypes: bodyParserConfig.enableTypes,
      encode: bodyParserConfig.encode,
      formLimit: bodyParserConfig.limit.form,
      jsonLimit: bodyParserConfig.limit.json,
      textLimit: bodyParserConfig.limit.form,
      strict: bodyParserConfig.strict,
      detectJSON: bodyParserConfig.detectJSON,
      extendTypes: bodyParserConfig.extendTypes,
      onerror: bodyParserConfig.onerror
    });
  }

  createGraphlConfig() {
    const graphqlConfig: GraphqlConfig = this.readConfigFile(path.join(process.cwd(), 'config/graphql.ts'));

    return {
      playground: graphqlConfig.playground,
      introspection: graphqlConfig.introspection,
      debug: graphqlConfig.debug,
      mocks: graphqlConfig.mocks,
      mockEntireSchema: graphqlConfig.mockEntireSchema,
      rootValue: graphqlConfig.rootValue
    };
  }

  createCorsConfig() {
    const corsConfig: CorsConfig = this.readConfigFile(path.join(process.cwd(), 'config/cors.ts'));

    if (corsConfig.enabled) {
      return koaCors(corsConfig);
    }

    return null;
  }

  readConfigBase() {
    const config: AppConfig = this.readConfigFile(path.join(process.cwd(), 'config/app.ts'));
    new Recife(config);
  }

  readConfigFile(filePath: string) {
    const sourceTs = fs.readFileSync(filePath);
    const sourceJs = ts.transpileModule(sourceTs.toString(), {
      compilerOptions: {
        module: ModuleKind.CommonJS,
        moduleResolution: ts.ModuleResolutionKind.NodeJs,
        esModuleInterop: true,
        target: ts.ScriptTarget.ES2015,
        allowJs: true
      }
    }).outputText;

    const script = new vm.Script(`const exports = {}; ${sourceJs};`);
    return script.runInNewContext();
  }
}

export default Config;
