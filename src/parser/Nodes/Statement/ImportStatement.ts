import AbstractNodeParser from '../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../../scanner/Token.js'
import { NodeSourceContext, AST_NODE_TYPE } from '../AbstractNode.js'
import AbstractStatement from './AbstractStatement.js'

export default class ImportStatement extends AbstractStatement {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.IMPORT_STATEMENT
  public readonly path: string

  constructor (sourceContext: NodeSourceContext, path: string) {
    super(sourceContext)
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
