import AbstractNodeParser from '../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../Scanner/Token.js'
import { NodeSourceContext, AST_NODE_TYPE } from '../AbstractNode.js'
import AbstractExpression from './AbstractExpression.js'

export default class ArrayExpression extends AbstractExpression {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.ARRAY_EXPRESSION
  public readonly elements: AbstractExpression[]

  constructor (sourceContext: NodeSourceContext, elements: AbstractExpression[]) {
    super(sourceContext)
    this.elements = elements
  }

  static fromParser (parser: AbstractNodeParser): ArrayExpression {
    parser.startParsing()
    parser.consume(TokenType.LEFT_BRACKET)

    const args: AbstractExpression[] = []

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
