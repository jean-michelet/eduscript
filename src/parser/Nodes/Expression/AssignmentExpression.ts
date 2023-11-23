import AbstractNodeParser from '../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../../scanner/Token.js'
import { NodeSourceContext, AST_NODE_TYPE } from '../AbstractNode.js'
import AbstractExpression from './AbstractExpression.js'
import Identifier from './Identifier.js'

export type AssignmentOperator = '=' | '+=' | '-=' | '*=' | '/='

export default class AssignmentExpression extends AbstractExpression {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.ASSIGNMENT_EXPRESSION
  public readonly operator: AssignmentOperator
  public readonly left: Identifier
  public readonly right: AbstractExpression

  constructor (sourceContext: NodeSourceContext, operator: AssignmentOperator, left: Identifier, right: AbstractExpression) {
    super(sourceContext)
    this.operator = operator
    this.left = left
    this.right = right
  }

  static fromParser (parser: AbstractNodeParser): AssignmentExpression {
    parser.startParsing()
    const id = Identifier.fromParser(parser)

    const operator = parser.consume(TokenType.ASSIGN).lexeme as AssignmentOperator

    const expr = parser.expression()
    return new AssignmentExpression(parser.endParsing(), operator, id, expr)
  }
}
