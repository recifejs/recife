import GraphParam from "./GraphParam";
import GraphTypeEnum from "./GraphTypeEnum";

class Graph {
  public name!: string;
  public type!: GraphTypeEnum;
  public params!: GraphParam;
}

export default Graph;
