import { NodeSourceContext } from '../../AbstractNode.js'
import { AST_NODE_TYPE } from '../../AstNode.js'
import AbstractStatement from '../AbstractStatement.js'

export default class ContinueStatement extends AbstractStatement {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.CONTINUE_STATEMENT
  public readonly level: number

  constructor (sourceContext: NodeSourceContext, level: number | null = null) {
    super(sourceContext)
    this.level = level ?? 1
  }
}
