import { Context } from '../../../Parser/ContextStack.js'
import { NodeParser } from '../../../Parser/Parser.js'
import { TokenType } from '../../../Scanner/Token.js'
import { AST_NODE_TYPE } from '../../AstNode.js'
import Expression from '../../Expression/Expression.js'
import Statement from '../Statement.js'

export default class ReturnStatement extends Statement {
  public readonly expression: Expression | null

  constructor (expression: Expression | null) {
    super(AST_NODE_TYPE.RETURN_STATEMENT)
    this.expression = expression
  }

  static fromParser (parser: NodeParser): ReturnStatement {
    if (!parser.contextStack.in(Context.FUNCTION)) {
      throw new SyntaxError('"return" outside a function.')
    }

    parser.consume(TokenType.RETURN)

    let expr: Expression | null = null
    if (!parser.lookaheadHasType(TokenType.SEMI_COLON)) {
      expr = parser.expression()
    }

    parser.consume(TokenType.SEMI_COLON)

    return new ReturnStatement(expr)
  }
}
