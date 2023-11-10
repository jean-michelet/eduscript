import AbstractNodeParser from '../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../Scanner/Token.js'
import { NodeAttributes } from '../AbstractNode.js'
import { AST_NODE_TYPE } from '../AstNode.js'
import AbstractStatement from './AbstractStatement.js'

export default class BlockStatement extends AbstractStatement {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.BLOCK_STATEMENT
  public readonly statements: AbstractStatement[]

  constructor (attributes: NodeAttributes, statements: AbstractStatement[]) {
    super(attributes)
    this.statements = statements
  }

  static fromParser (parser: AbstractNodeParser): BlockStatement {
    parser.startParsing()

    parser.consume(TokenType.LEFT_CBRACE)

    const stmts = parser.lookaheadHasType(TokenType.RIGHT_CBRACE)
      ? []
      : parser.statements()

    parser.consume(TokenType.RIGHT_CBRACE)

    return new BlockStatement(parser.endParsing(), stmts)
  }
}
