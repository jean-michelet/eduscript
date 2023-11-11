import { AST_NODE_TYPE } from './AstNode.js'

export interface NodeSourceContext {
  startLine: number
  startTokenPos: number
  startFilePos: number
  endLine: number
  endTokenPos: number
  endFilePos: number
}

export default abstract class AbstractNode {
  public abstract readonly type: AST_NODE_TYPE
  public readonly sourceContext: NodeSourceContext

  constructor (sourceContext: NodeSourceContext) {
    this.sourceContext = sourceContext
  }
}
