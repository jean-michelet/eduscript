import { NodeAttributes } from '../AbstractNode.js'
import { AST_NODE_TYPE } from '../AstNode.js'
import Expression from '../Expression/Expression.js'
import AbstractStatement from './AbstractStatement.js'

export default class ExpressionStatement extends AbstractStatement {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.EXPRESSION_STATEMENT
  public readonly expression: Expression

  constructor (attributes: NodeAttributes, expression: Expression) {
    super(attributes)
    this.expression = expression
  }
}
