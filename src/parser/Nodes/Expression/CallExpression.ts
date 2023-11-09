import AbstractNodeParser from '../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../Scanner/Token.js'
import { AST_NODE_TYPE } from '../AstNode.js'
import Expression from './Expression.js'
import Identifier from './Identifier.js'
import MemberExpression from './MemberExpression.js'

export default class CallExpression extends Expression {
  public readonly callee: Identifier | MemberExpression
  public readonly args: Expression[]

  constructor (callee: Identifier | MemberExpression, args: Expression[]) {
    super(AST_NODE_TYPE.CALL_EXPRESSION)
    this.callee = callee
    this.args = args
  }

  static fromParser (parser: AbstractNodeParser, id: Identifier | MemberExpression): CallExpression {
    parser.consume(TokenType.LEFT_PAREN)

    const args: Expression[] = []

    // argument list shouldn't start or end with a coma: ','
    while (!parser.eof() && !parser.lookaheadHasType(TokenType.COMA) && !parser.lookaheadHasType(TokenType.RIGHT_PAREN)) {
      args.push(parser.expression())

      if (!parser.lookaheadHasType(TokenType.COMA)) {
        break
      }

      parser.consume(TokenType.COMA)
    }

    parser.consume(TokenType.RIGHT_PAREN)

    return new CallExpression(id, args)
  }
}
