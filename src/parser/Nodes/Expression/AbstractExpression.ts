import AbstractNode from '../AbstractNode.js'
import Expression from './Expression.js'
import LeftHandSideExpression from './LeftHandSideExpression.js'
import LiteralExpression from './LiteralExpression.js'

export default abstract class AbstractExpression extends AbstractNode {}

export type PrimaryExpression =
   LiteralExpression
   | LeftHandSideExpression
   | Expression
