import AbstractNodeParser from '../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../Scanner/Token.js'
import { NodeSourceContext, AST_NODE_TYPE } from '../AbstractNode.js'
import AbstractExpression from './AbstractExpression.js'

export type Literal = string | number | boolean | null | undefined
export type LiteralKind = 'string' | 'number' | 'boolean' | 'null'

export default class LiteralExpression extends AbstractExpression {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.LITERAL_EXPRESSION
  public readonly literal: Literal
  public readonly kind: LiteralKind

  constructor (sourceContext: NodeSourceContext, literal: Literal, kind: LiteralKind) {
    super(sourceContext)
    this.literal = literal
    this.kind = kind
  }

  static fromParser (parser: AbstractNodeParser): LiteralExpression {
    parser.startParsing()
    const tokenType = parser.getLookahead().type
    const value = parser.getLookahead().value as Literal

    let kind: LiteralKind
    if (tokenType === TokenType.NUMBER) {
      kind = 'number'
    } else if (tokenType === TokenType.STRING) {
      kind = 'string'
    } else {
      kind = 'boolean'
    }

    parser.consume(tokenType)

    return new LiteralExpression(parser.endParsing(), value, kind)
  }
}
