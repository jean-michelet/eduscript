import Parser from '../../Parser/Parser.js'
import { TokenType } from '../../Scanner/Token.js'
import { AST_NODE_TYPE } from '../AstNode.js'
import Expression from './Expression.js'

export default class ArrayExpression extends Expression {
  public readonly elements: Expression[]

  constructor (elements: Expression[]) {
    super(AST_NODE_TYPE.ARRAY_EXPRESSION)
    this.elements = elements
  }

  static fromParser (parser: Parser): ArrayExpression {
    parser.consume(TokenType.LEFT_BRACKET)

    const args: Expression[] = []

    // argument list shouldn't start or end with a coma: ','
    while (!parser.eof() && !parser.lookaheadHasType(TokenType.COMA) && !parser.lookaheadHasType(TokenType.RIGHT_BRACKET)) {
      args.push(parser.expression())

      if (!parser.lookaheadHasType(TokenType.COMA)) {
        break
      }

      parser.consume(TokenType.COMA)
    }

    parser.consume(TokenType.RIGHT_BRACKET)

    return new ArrayExpression(args)
  }
}
