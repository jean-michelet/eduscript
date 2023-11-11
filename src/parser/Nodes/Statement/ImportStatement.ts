import AbstractNodeParser from '../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../Scanner/Token.js'
import { NodeAttributes } from '../AbstractNode.js'
import { AST_NODE_TYPE } from '../AstNode.js'
import AbstractStatement from './AbstractStatement.js'

export default class ImportStatement extends AbstractStatement {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.IMPORT_STATEMENT
  public readonly path: string

  constructor (attributes: NodeAttributes, path: string) {
    super(attributes)
    this.path = path
  }

  static fromParser (parser: AbstractNodeParser): ImportStatement {
    parser.startParsing()
    parser.consume(TokenType.IMPORT)

    const path = parser.consume(TokenType.STRING).value as string

    parser.consume(TokenType.SEMI_COLON)

    return new ImportStatement(parser.endParsing(), path)
  }
}
