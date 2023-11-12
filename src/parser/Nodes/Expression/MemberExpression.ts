import AbstractNodeParser from '../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../Scanner/Token.js'
import { NodeSourceContext } from '../AbstractNode.js'
import { AST_NODE_TYPE } from '../AstNode.js'
import AbstractExpression from './AbstractExpression.js'
import Identifier from './Identifier.js'

export default class MemberExpression extends AbstractExpression {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.MEMBER_EXPRESSION
  public readonly property: Identifier
  public readonly object: Identifier | MemberExpression

  constructor (sourceContext: NodeSourceContext, id: Identifier, object: Identifier | MemberExpression) {
    super(sourceContext)
    this.property = id
    this.object = object
  }

  static fromParser (parser: AbstractNodeParser, id: Identifier): MemberExpression {
    parser.startParsing()

    parser.consume(TokenType.DOT)

    let object: Identifier | MemberExpression = Identifier.fromParser(parser)
    if (parser.lookaheadHasType(TokenType.DOT)) {
      object = this.fromParser(parser, object)
    }

    return new MemberExpression(parser.endParsing(), id, object)
  }
}
