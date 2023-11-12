import { NodeSourceContext } from '../AbstractNode.js'
import { AST_NODE_TYPE } from '../AstNode.js'
import AbstractExpression from './AbstractExpression.js'
import Expression from './Expression.js'
import LeftHandSideExpression from './LeftHandSideExpression.js'

export type AssignmentOperator = '=' | '+=' | '-=' | '*=' | '/='

export default class AssignmentExpression extends AbstractExpression {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.ASSIGNMENT_EXPRESSION
  public readonly operator: AssignmentOperator
  public readonly left: LeftHandSideExpression
  public readonly right: Expression

  constructor (sourceContext: NodeSourceContext, operator: AssignmentOperator, left: LeftHandSideExpression, right: Expression) {
    super(sourceContext)
    this.operator = operator
    this.left = left
    this.right = right
  }
}
