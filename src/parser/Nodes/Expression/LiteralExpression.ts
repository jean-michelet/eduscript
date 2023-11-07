import Parser from '../../Parser/Parser.js'
import { TokenType } from '../../Scanner/Token.js'
import { AST_NODE_TYPE } from '../AstNode.js'
import Expression from './Expression.js'

export type Literal = string | number | boolean
export type LiteralKind = 'String' | 'Number' | 'Boolean'

export default class LiteralExpression extends Expression {
  public readonly literal: Literal
  public readonly kind: LiteralKind

  constructor (literal: Literal, kind: LiteralKind) {
    super(AST_NODE_TYPE.LITERAL_EXPRESSION)
    this.literal = literal
    this.kind = kind
  }

  static fromParser (parser: Parser): LiteralExpression {
    const tokenType = parser.getLookahead().type
    const value = parser.getLookahead().value as Literal

    let kind: LiteralKind
    if (tokenType === TokenType.NUMBER) {
      kind = 'Number'
    } else if (tokenType === TokenType.STRING) {
      kind = 'String'
    } else {
      kind = 'Boolean'
    }

    parser.consume(tokenType)

    return new LiteralExpression(value, kind)
  }
}
