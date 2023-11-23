import AbstractNodeParser from '../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../../scanner/Token.js'
import { NodeSourceContext, AST_NODE_TYPE } from '../AbstractNode.js'
import AbstractExpression from './AbstractExpression.js'
import Identifier from './Identifier.js'

export default class ArrayAccessExpression extends AbstractExpression {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.ARRAY_ACCESS_EXPRESSION
  public readonly index: number
  public readonly array: Identifier | ArrayAccessExpression

  constructor (sourceContext: NodeSourceContext, array: Identifier | ArrayAccessExpression, index: number) {
    super(sourceContext)
    this.array = array
    this.index = index
  }

  static parse (parser: AbstractNodeParser, id: Identifier | ArrayAccessExpression): ArrayAccessExpression {
    parser.consume(TokenType.LEFT_BRACKET)

    const index = parser.consume(TokenType.NUMBER).value as number

    parser.consume(TokenType.RIGHT_BRACKET)

    if (parser.lookaheadHasType(TokenType.LEFT_BRACKET)) {
      parser.startParsing()
      id = this.parse(parser, id)
    }

    return new ArrayAccessExpression(parser.endParsing(), id, index)
  }

  static fromParser (parser: AbstractNodeParser): ArrayAccessExpression {
    parser.startParsing()
    const id = Identifier.fromParser(parser)

    return this.parse(parser, id)
  }
}
