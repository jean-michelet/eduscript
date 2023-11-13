import { NodeSourceContext, AST_NODE_TYPE } from '../AbstractNode.js'
import AbstractExpression from './AbstractExpression.js'
import Identifier from './Identifier.js'

export default class AssignmentPattern extends AbstractExpression {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.ASSIGNMENT_PATTERN
  public readonly left: Identifier
  public readonly right: AbstractExpression

  constructor (sourceContext: NodeSourceContext, left: Identifier, right: AbstractExpression) {
    super(sourceContext)
    this.left = left
    this.right = right
  }
}
