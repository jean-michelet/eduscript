import AbstractNodeParser from '../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../../scanner/Token.js'
import { NodeSourceContext, AST_NODE_TYPE } from '../AbstractNode.js'
import AbstractExpression from './AbstractExpression.js'

export type Literal = string | number | boolean | null | undefined
export type LiteralKind = 'string' | 'number' | 'boolean' | 'null' | 'undefined'

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
    let value = parser.getLookahead().value as Literal
    let kind: LiteralKind = 'null'

    if (tokenType === TokenType.BUILTIN_TYPE) {
      kind = parser.getLookahead().lexeme as LiteralKind
      value = kind === 'null' ? null : undefined
    } else if (tokenType === TokenType.NUMBER) {
      kind = 'number'
    } else if (tokenType === TokenType.STRING) {
      kind = 'string'
    } else if (tokenType === TokenType.BOOLEAN) {
      kind = 'boolean'
    }

    parser.consume(tokenType)

    return new LiteralExpression(parser.endParsing(), value, kind)
  }
}
