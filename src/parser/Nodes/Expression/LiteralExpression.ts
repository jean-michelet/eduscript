import AbstractNodeParser from '../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../Scanner/Token.js'
import { AST_NODE_TYPE } from '../AstNode.js'
import Expression from './Expression.js'

export type Literal = string | number | boolean | null
export type LiteralKind = 'string' | 'number' | 'boolean' | 'null'

export default class LiteralExpression extends Expression {
  public readonly literal: Literal
  public readonly kind: LiteralKind

  constructor (literal: Literal, kind: LiteralKind) {
    super(AST_NODE_TYPE.LITERAL_EXPRESSION)
    this.literal = literal
    this.kind = kind
  }

  static fromParser (parser: AbstractNodeParser): LiteralExpression {
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

    return new LiteralExpression(value, kind)
  }
}
