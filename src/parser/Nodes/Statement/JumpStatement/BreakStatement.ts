import { AST_NODE_TYPE } from '../../AstNode.js'
import Statement from '../Statement.js'

export default class BreakStatement extends Statement {
  public readonly level: number

  constructor (level: number | null) {
    super(AST_NODE_TYPE.BREAK_STATEMENT)
    this.level = level ?? 1
  }
}
