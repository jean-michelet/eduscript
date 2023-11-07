import Parser from '../../Parser/Parser.js'
import { TokenType } from '../../Scanner/Token.js'
import { AST_NODE_TYPE } from '../AstNode.js'
import Expression from './Expression.js'
import Identifier from './Identifier.js'

export default class ArrayAccessExpression extends Expression {
  public readonly index: number
  public readonly array: Identifier | ArrayAccessExpression

  constructor (array: Identifier | ArrayAccessExpression, index: number) {
    super(AST_NODE_TYPE.ARRAY_ACCESS_EXPRESSION)
    this.array = array
    this.index = index
  }

  static fromParser (parser: Parser, id: Identifier | ArrayAccessExpression): ArrayAccessExpression {
    parser.consume(TokenType.LEFT_BRACKET)

    const index = parser.consume(TokenType.NUMBER).value as number

    parser.consume(TokenType.RIGHT_BRACKET)

    if (parser.lookaheadHasType(TokenType.LEFT_BRACKET)) {
      id = this.fromParser(parser, id)
    }

    return new ArrayAccessExpression(id, index)
  }
}
