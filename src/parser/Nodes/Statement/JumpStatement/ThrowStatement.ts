import { NodeSourceContext } from '../../AbstractNode.js'
import { AST_NODE_TYPE } from '../../AstNode.js'
import Expression from '../../Expression/Expression.js'
import AbstractStatement from '../AbstractStatement.js'

export default class ThrowStatement extends AbstractStatement {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.THROW_STATEMENT
  public readonly expression: Expression

  constructor (sourceContext: NodeSourceContext, expression: Expression) {
    super(sourceContext)
    this.expression = expression
  }
}
