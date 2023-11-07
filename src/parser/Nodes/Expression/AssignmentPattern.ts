import { AST_NODE_TYPE } from '../AstNode.js'
import Expression from './Expression.js'
import Identifier from './Identifier.js'

export default class AssignmentPattern extends Expression {
  public readonly left: Identifier
  public readonly right: Expression

  constructor (left: Identifier, right: Expression) {
    super(AST_NODE_TYPE.ASSIGNMENT_PATTERN)
    this.left = left
    this.right = right
  }
}
