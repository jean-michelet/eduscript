import { AST_NODE_TYPE } from '../AstNode.js'
import Expression from './Expression.js'
import LeftHandSideExpression from './LeftHandSideExpression.js'

export type AssignmentOperator = '=' | '+=' | '-=' | '*=' | '/='

export default class AssignmentExpression extends Expression {
  public readonly operator: AssignmentOperator
  public readonly left: LeftHandSideExpression
  public readonly right: Expression

  constructor (operator: AssignmentOperator, left: LeftHandSideExpression, right: Expression) {
    super(AST_NODE_TYPE.ASSIGNMENT_EXPRESSION)
    this.operator = operator
    this.left = left
    this.right = right
  }
}
