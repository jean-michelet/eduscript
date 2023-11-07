import { AST_NODE_TYPE } from '../AstNode.js'
import Expression from './Expression.js'
import LeftHandSideExpression from './LeftHandSideExpression.js'

export default class Identifier extends Expression implements LeftHandSideExpression {
  public readonly name: string

  constructor (_name: string) {
    super(AST_NODE_TYPE.IDENTIFIER)
    this.name = _name
  }
}
