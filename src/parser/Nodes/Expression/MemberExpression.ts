import AbstractNodeParser from '../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../Scanner/Token.js'
import { NodeSourceContext, AST_NODE_TYPE } from '../AbstractNode.js'
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

  static parse (parser: AbstractNodeParser, id: Identifier, hasStarted = false): Identifier | MemberExpression {
    if (!hasStarted) {
      parser.startParsing()
    }

    parser.consume(TokenType.DOT)

    let object: Identifier | MemberExpression = Identifier.fromParser(parser)
    if (parser.lookaheadHasType(TokenType.DOT)) {
      object = this.parse(parser, object)
    }

    return new MemberExpression(parser.endParsing(), id, object)
  }

  static fromParser (parser: AbstractNodeParser, id: Identifier): MemberExpression {
    return this.parse(parser, id, true) as MemberExpression
  }
}
