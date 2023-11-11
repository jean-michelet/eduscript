import AbstractNodeParser from '../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../Scanner/Token.js'
import { AST_NODE_TYPE } from '../AstNode.js'
import AbstractStatement from './AbstractStatement.js'

export default class EmptyStatement extends AbstractStatement {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.EMPTY_STATEMENT

  static fromParser (parser: AbstractNodeParser): EmptyStatement {
    parser.startParsing()
    parser.consume(TokenType.SEMI_COLON)

    return new EmptyStatement(parser.endParsing())
  }
}
