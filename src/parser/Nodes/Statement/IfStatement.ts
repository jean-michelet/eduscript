import AbstractNodeParser from '../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../Scanner/Token.js'
import { NodeAttributes } from '../AbstractNode.js'
import { AST_NODE_TYPE } from '../AstNode.js'
import Expression from '../Expression/Expression.js'
import AbstractStatement from './AbstractStatement.js'
import BlockStatement from './BlockStatement.js'

export default class IfStatement extends AbstractStatement {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.IF_STATEMENT
  public readonly test: Expression
  public readonly consequent: BlockStatement
  public readonly alternate: BlockStatement | IfStatement | null

  constructor (attributes: NodeAttributes, test: Expression, consequent: BlockStatement, alternate: BlockStatement | IfStatement | null = null) {
    super(attributes)
    this.test = test
    this.consequent = consequent
    this.alternate = alternate
  }

  static fromParser (parser: AbstractNodeParser, ifOrElseIf: TokenType.IF | TokenType.ELSE_IF = TokenType.IF): IfStatement {
    parser.startParsing()
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

    return new IfStatement(parser.endParsing(), test, consequent, alternate)
  }
}
