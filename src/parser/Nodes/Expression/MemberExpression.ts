import { NodeParser } from '../../Parser/Parser.js'
import { TokenType } from '../../Scanner/Token.js'
import { AST_NODE_TYPE } from '../AstNode.js'
import Expression from './Expression.js'
import Identifier from './Identifier.js'

export default class MemberExpression extends Expression {
  public readonly property: Identifier
  public readonly object: Identifier | MemberExpression

  constructor (id: Identifier, object: Identifier | MemberExpression) {
    super(AST_NODE_TYPE.MEMBER_EXPRESSION)
    this.property = id
    this.object = object
  }

  static fromParser (parser: NodeParser, id: Identifier): MemberExpression {
    parser.consume(TokenType.DOT)

    let object: Identifier | MemberExpression = new Identifier(parser.consume(TokenType.IDENTIFIER).lexeme)
    if (parser.lookaheadHasType(TokenType.DOT)) {
      object = this.fromParser(parser, object)
    }

    return new MemberExpression(id, object)
  }
}
