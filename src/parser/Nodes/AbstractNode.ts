import { AST_NODE_TYPE } from './AstNode.js'

export interface NodeAttributes {
  startLine: number
  endLine: number
  startTokenPos: number
  endTokenPos: number
  startFilePos: number
  endFilePos: number
}

export default abstract class AbstractNode {
  public abstract readonly type: AST_NODE_TYPE
  protected _attributes: NodeAttributes

  constructor (attributes: NodeAttributes) {
    this._attributes = attributes
  }
}
