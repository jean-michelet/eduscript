import AbstractNodeParser from '../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../Scanner/Token.js'
import { AST_NODE_TYPE, NodeSourceContext } from '../AbstractNode.js'
import AbstractExpression from './AbstractExpression.js'

export default class ParenthesizedExpression extends AbstractExpression {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.EXPRESSION_STATEMENT
  public readonly expression: AbstractExpression

  constructor (sourceContext: NodeSourceContext, expression: AbstractExpression) {
    super(sourceContext)
    this.expression = expression
  }

  static fromParser (parser: AbstractNodeParser): ParenthesizedExpression {
    parser.startParsing()

    parser.consume(TokenType.LEFT_PAREN)
    const expression = parser.expression()
    parser.consume(TokenType.RIGHT_PAREN)

    return new ParenthesizedExpression(parser.endParsing(), expression)
  }
}
