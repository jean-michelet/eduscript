import AbstractNodeParser from '../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../../scanner/Token.js'
import { NodeSourceContext, AST_NODE_TYPE } from '../AbstractNode.js'
import AbstractExpression from '../Expression/AbstractExpression.js'
import AbstractStatement from './AbstractStatement.js'

export default class ExpressionStatement extends AbstractStatement {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.EXPRESSION_STATEMENT
  public readonly expression: AbstractExpression

  constructor (sourceContext: NodeSourceContext, expression: AbstractExpression) {
    super(sourceContext)
    this.expression = expression
  }

  static fromParser (parser: AbstractNodeParser): ExpressionStatement {
    parser.startParsing()
    const expression = parser.expression()
    parser.consume(TokenType.SEMI_COLON)

    return new ExpressionStatement(parser.endParsing(), expression)
  }
}
