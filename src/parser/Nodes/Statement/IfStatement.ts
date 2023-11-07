import Parser from '../../Parser/Parser.js'
import { TokenType } from '../../Scanner/Token.js'
import { AST_NODE_TYPE } from '../AstNode.js'
import Expression from '../Expression/Expression.js'
import BlockStatement from './BlockStatement.js'
import Statement from './Statement.js'

export default class IfStatement extends Statement {
  public readonly test: Expression
  public readonly consequent: BlockStatement
  public readonly alternate: BlockStatement | IfStatement | null

  constructor (test: Expression, consequent: BlockStatement, alternate: BlockStatement | IfStatement | null = null) {
    super(AST_NODE_TYPE.IF_STATEMENT)
    this.test = test
    this.consequent = consequent
    this.alternate = alternate
  }

  static fromParser (parser: Parser, ifOrElseIf: TokenType.IF | TokenType.ELSE_IF = TokenType.IF): IfStatement {
    parser.consume(ifOrElseIf)

    const test = parser.expression()
    const consequent = BlockStatement.fromParser(parser)

    let alternate: BlockStatement | IfStatement | null = null
    while (parser.lookaheadHasType(TokenType.ELSE_IF)) {
      alternate = IfStatement.fromParser(parser, TokenType.ELSE_IF)
    }

    if (parser.lookaheadHasType(TokenType.ELSE)) {
      parser.consume(TokenType.ELSE)
      alternate = BlockStatement.fromParser(parser)
    }

    return new IfStatement(test, consequent, alternate)
  }
}
