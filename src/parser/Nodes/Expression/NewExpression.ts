import AbstractNodeParser from '../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../Scanner/Token.js'
import { NodeSourceContext, AST_NODE_TYPE } from '../AbstractNode.js'
import AbstractExpression from './AbstractExpression.js'
import Identifier from './Identifier.js'

export default class NewExpression extends AbstractExpression {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.CALL_EXPRESSION
  public readonly identifier: Identifier
  public readonly args: AbstractExpression[]

  constructor (sourceContext: NodeSourceContext, id: Identifier, args: AbstractExpression[]) {
    super(sourceContext)
    this.identifier = id
    this.args = args
  }

  static fromParser (parser: AbstractNodeParser): NewExpression {
    parser.startParsing()
    parser.consume(TokenType.NEW)

    const id = Identifier.fromParser(parser)

    parser.consume(TokenType.LEFT_PAREN)

    const args = parser.parseArgs()

    parser.consume(TokenType.RIGHT_PAREN)

    return new NewExpression(parser.endParsing(), id, args)
  }
}
