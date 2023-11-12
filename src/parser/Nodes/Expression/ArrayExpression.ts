import AbstractNodeParser from '../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../Scanner/Token.js'
import { NodeSourceContext } from '../AbstractNode.js'
import { AST_NODE_TYPE } from '../AstNode.js'
import AbstractExpression from './AbstractExpression.js'
import Expression from './Expression.js'

export default class ArrayExpression extends AbstractExpression {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.ARRAY_EXPRESSION
  public readonly elements: Expression[]

  constructor (sourceContext: NodeSourceContext, elements: Expression[]) {
    super(sourceContext)
    this.elements = elements
  }

  static fromParser (parser: AbstractNodeParser): ArrayExpression {
    parser.startParsing()
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

    return new ArrayExpression(parser.endParsing(), args)
  }
}
