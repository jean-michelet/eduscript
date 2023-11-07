import Parser from '../../Parser/Parser.js'
import { TokenType } from '../../Scanner/Token.js'
import { AST_NODE_TYPE } from '../AstNode.js'
import EmptyStatement from './EmptyStatement.js'
import Statement from './Statement.js'

export default class BlockStatement extends Statement {
  public readonly statements: Statement[]

  constructor (statements: Statement[]) {
    super(AST_NODE_TYPE.BLOCK_STATEMENT)
    this.statements = statements
  }

  static fromParser (parser: Parser): BlockStatement {
    parser.consume(TokenType.LEFT_CBRACE)

    const stmts = parser.lookaheadHasType(TokenType.RIGHT_CBRACE)
      ? [new EmptyStatement()]
      : parser.statements()

    parser.consume(TokenType.RIGHT_CBRACE)

    return new BlockStatement(stmts)
  }
}
