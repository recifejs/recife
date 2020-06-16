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
