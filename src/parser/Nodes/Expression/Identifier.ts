import AbstractNodeParser from '../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../../scanner/Token.js'
import { NodeSourceContext, AST_NODE_TYPE } from '../AbstractNode.js'
import AbstractExpression from './AbstractExpression.js'

export default class Identifier extends AbstractExpression {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.IDENTIFIER
  public readonly name: string

  constructor (sourceContext: NodeSourceContext, name: string) {
    super(sourceContext)
    this.name = name
  }

  static fromParser (parser: AbstractNodeParser): Identifier {
    parser.startParsing()

    const name = parser.consume(TokenType.IDENTIFIER).lexeme

    return new Identifier(parser.endParsing(), name)
  }
}
