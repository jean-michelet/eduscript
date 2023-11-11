import { Context } from '../../../../ContextStack/ContextStack.js'
import AbstractNodeParser from '../../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../../Scanner/Token.js'
import { AST_NODE_TYPE } from '../../AstNode.js'
import Expression from '../../Expression/Expression.js'
import AbstractStatement from '../AbstractStatement.js'
import { NodeSourceContext } from '../../AbstractNode.js'

export default class ReturnStatement extends AbstractStatement {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.RETURN_STATEMENT
  public readonly expression: Expression | null

  constructor (sourceContext: NodeSourceContext, expression: Expression | null) {
    super(sourceContext)
    this.expression = expression
  }

  static fromParser (parser: AbstractNodeParser): ReturnStatement {
    parser.startParsing()
    if (!parser.contextStack.inContext(Context.FUNCTION)) {
      throw new SyntaxError('"return" outside a function.')
    }

    parser.consume(TokenType.RETURN)

    let expr: Expression | null = null
    if (!parser.lookaheadHasType(TokenType.SEMI_COLON)) {
      expr = parser.expression()
    }

    parser.consume(TokenType.SEMI_COLON)

    return new ReturnStatement(parser.endParsing(), expr)
  }
}
