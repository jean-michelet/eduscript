import AbstractNodeParser from '../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../Scanner/Token.js'
import { AST_NODE_TYPE } from '../AstNode.js'
import Statement from './Statement.js'

export default class EmptyStatement extends Statement {
  constructor () {
    super(AST_NODE_TYPE.EMPTY_STATEMENT)
  }

  static fromParser (parser: AbstractNodeParser): EmptyStatement {
    parser.consume(TokenType.SEMI_COLON)

    return new EmptyStatement()
  }
}
