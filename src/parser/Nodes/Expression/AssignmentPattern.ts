import { NodeSourceContext } from '../AbstractNode.js'
import { AST_NODE_TYPE } from '../AstNode.js'
import AbstractExpression from './AbstractExpression.js'
import Expression from './Expression.js'
import Identifier from './Identifier.js'

export default class AssignmentPattern extends AbstractExpression {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.ASSIGNMENT_PATTERN
  public readonly left: Identifier
  public readonly right: Expression

  constructor (sourceContext: NodeSourceContext, left: Identifier, right: Expression) {
    super(sourceContext)
    this.left = left
    this.right = right
  }
}
