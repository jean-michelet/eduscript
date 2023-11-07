import { AST_NODE_TYPE } from '../AstNode.js'
import Expression from '../Expression/Expression.js'
import Statement from './Statement.js'

export default class ExpressionStatement extends Statement {
  public readonly expression: Expression

  constructor (expression: Expression) {
    super(AST_NODE_TYPE.EXPRESSION_STATEMENT)
    this.expression = expression
  }
}
