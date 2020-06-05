import GraphParam from './GraphParam';
import GraphTypeEnum from './GraphTypeEnum';

class Graph {
  public name!: string;
  public type!: GraphTypeEnum;
  public params!: GraphParam;
  public nameContext!: string;
  public returnType?: string;
}

export default Graph;
