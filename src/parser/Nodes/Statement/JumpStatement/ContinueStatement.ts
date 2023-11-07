import { AST_NODE_TYPE } from '../../AstNode.js'
import Statement from '../Statement.js'

export default class ContinueStatement extends Statement {
  public readonly level: number | null

  constructor (level: number | null = null) {
    super(AST_NODE_TYPE.CONTINUE_STATEMENT)
    this.level = level ?? 1
  }
}
