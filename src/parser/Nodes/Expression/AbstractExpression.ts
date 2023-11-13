import AbstractNode from '../AbstractNode.js'
import LeftHandSideExpression from './LeftHandSideExpression.js'
import LiteralExpression from './LiteralExpression.js'

export default abstract class AbstractExpression extends AbstractNode {}

export type PrimaryExpression =
   LiteralExpression
   | LeftHandSideExpression
