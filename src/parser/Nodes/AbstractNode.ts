import { AST_NODE_TYPE } from './AstNode.js'

export interface AbstractNodeAttributes {
  startLine: number
  endLine: number
  startTokenPos: number
  endTokenPos: number
  startFilePos: number
  endFilePos: number
}

export default abstract class AbstracNode {
  public abstract readonly type: AST_NODE_TYPE
  public readonly attributes: AbstractNodeAttributes

  constructor (attributes: AbstractNodeAttributes) {
    this.attributes = attributes
  }
}
