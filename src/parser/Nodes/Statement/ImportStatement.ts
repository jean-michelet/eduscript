import Parser from '../../Parser/Parser.js'
import { TokenType } from '../../Scanner/Token.js'
import { AST_NODE_TYPE } from '../AstNode.js'
import Statement from './Statement.js'

export default class ImportStatement extends Statement {
  public readonly path: string

  constructor (path: string) {
    super(AST_NODE_TYPE.IMPORT_STATEMENT)
    this.path = path
  }

  static fromParser (parser: Parser): ImportStatement {
    parser.consume(TokenType.IMPORT)

    const path = parser.consume(TokenType.STRING).value as string

    parser.consume(TokenType.SEMI_COLON)

    return new ImportStatement(path)
  }
}
