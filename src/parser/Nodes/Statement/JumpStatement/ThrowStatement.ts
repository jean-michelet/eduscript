import { NodeSourceContext, AST_NODE_TYPE } from '../../AbstractNode.js'
import AbstractExpression from '../../Expression/AbstractExpression.js'
import AbstractStatement from '../AbstractStatement.js'

export default class ThrowStatement extends AbstractStatement {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.THROW_STATEMENT
  public readonly expression: AbstractExpression

  constructor (sourceContext: NodeSourceContext, expression: AbstractExpression) {
    super(sourceContext)
    this.expression = expression
  }
}
