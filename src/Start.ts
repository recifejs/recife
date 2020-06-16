import * as ts from 'typescript';
import Program from './Program';
import Log from './log';

class Start extends Program {
  run() {
    Log.Instance.infoHeap('Initializing');
    const configPath = ts.findConfigFile(process.cwd(), ts.sys.fileExists, 'tsconfig.json');
    if (!configPath) {
      throw new Error("Could not find a valid 'tsconfig.json'.");
    }

    const createProgram = ts.createSemanticDiagnosticsBuilderProgram;
    const host = ts.createWatchCompilerHost(configPath, {}, ts.sys, createProgram, undefined, () => {});

    const origCreateProgram = host.createProgram;
    host.createProgram = (rootNames: ReadonlyArray<string> | undefined, options, host, oldProgram) => {
      Log.Instance.infoHeap('Created the program!');
      return origCreateProgram(rootNames, options, host, oldProgram);
    };

    const origPostProgramCreate = host.afterProgramCreate;
    host.afterProgramCreate = program => {
      Log.Instance.infoHeap('Finished making the program!');
      origPostProgramCreate!(program);
      Log.Instance.infoHeap('Compiling the graphql!');
      this.start();
    };

    const watch = ts.createWatchProgram(host);
    watch.close();
  }
}

export default Start;
