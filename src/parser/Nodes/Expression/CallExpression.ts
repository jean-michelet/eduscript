import AbstractNodeParser from '../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../../scanner/Token.js'
import { NodeSourceContext, AST_NODE_TYPE } from '../AbstractNode.js'
import AbstractExpression from './AbstractExpression.js'
import Identifier from './Identifier.js'
import MemberExpression from './MemberExpression.js'

export default class CallExpression extends AbstractExpression {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.CALL_EXPRESSION
  public readonly callee: Identifier | MemberExpression
  public readonly args: AbstractExpression[]

  constructor (sourceContext: NodeSourceContext, callee: Identifier | MemberExpression, args: AbstractExpression[]) {
    super(sourceContext)
    this.callee = callee
    this.args = args
  }

  static fromParser (parser: AbstractNodeParser, id: Identifier | MemberExpression): CallExpression {
    parser.consume(TokenType.LEFT_PAREN)

    const args = parser.parseArgs()

    parser.consume(TokenType.RIGHT_PAREN)

    return new CallExpression(parser.endParsing(), id, args)
  }
}
