import AstNode from '../AstNode.js'
import LeftHandSideExpression from './LeftHandSideExpression.js'
import LiteralExpression from './LiteralExpression.js'

export default class Expression extends AstNode {}

export type PrimaryExpression =
   LiteralExpression
   | LeftHandSideExpression
   | Expression
