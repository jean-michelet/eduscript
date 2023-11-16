import AbstractNodeParser from '../../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../../Scanner/Token.js'
import { AST_NODE_TYPE, NodeSourceContext } from '../../AbstractNode.js'
import AbstractStatement from '../AbstractStatement.js'
import AbstractExpression from '../../Expression/AbstractExpression.js'

export default class ReturnStatement extends AbstractStatement {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.RETURN_STATEMENT
  public readonly expression: AbstractExpression | null

  constructor (sourceContext: NodeSourceContext, expression: AbstractExpression | null) {
    super(sourceContext)
    this.expression = expression
  }

  static fromParser (parser: AbstractNodeParser): ReturnStatement {
    parser.startParsing()
    parser.consume(TokenType.RETURN)

    let expr: AbstractExpression | null = null
    if (!parser.lookaheadHasType(TokenType.SEMI_COLON)) {
      expr = parser.expression()
    }

    parser.consume(TokenType.SEMI_COLON)

    return new ReturnStatement(parser.endParsing(), expr)
  }
}
