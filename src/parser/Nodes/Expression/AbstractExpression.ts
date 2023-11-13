import AbstractNode from '../AbstractNode.js'
import ArrayAccessExpression from './ArrayAccessExpression.js'
import ArrayExpression from './ArrayExpression.js'
import AssignmentExpression from './AssignmentExpression.js'
import CallExpression from './CallExpression.js'
import Identifier from './Identifier.js'
import LiteralExpression from './LiteralExpression.js'
import MemberExpression from './MemberExpression.js'
import ParenthesizedExpression from './ParenthesizedExpression.js'

export default abstract class AbstractExpression extends AbstractNode {}

export type PrimaryExpression =
   LiteralExpression
   | ParenthesizedExpression
   | LeftHandSideExpression
   | ArrayExpression

export type LeftHandSideExpression =
   Identifier
   | AssignmentExpression
   | ArrayAccessExpression
   | CallExpression
   | MemberExpression
