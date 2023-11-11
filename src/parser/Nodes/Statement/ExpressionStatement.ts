import AbstractNodeParser from '../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../Scanner/Token.js'
import { NodeSourceContext } from '../AbstractNode.js'
import { AST_NODE_TYPE } from '../AstNode.js'
import Expression from '../Expression/Expression.js'
import AbstractStatement from './AbstractStatement.js'

export default class ExpressionStatement extends AbstractStatement {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.EXPRESSION_STATEMENT
  public readonly expression: Expression

  constructor (sourceContext: NodeSourceContext, expression: Expression) {
    super(sourceContext)
    this.expression = expression
  }

  static fromParser (parser: AbstractNodeParser): ExpressionStatement {
    parser.startParsing()
    const expression = parser.expression()
    parser.consume(TokenType.SEMI_COLON)

    return new ExpressionStatement(parser.endParsing(), expression)
  }
}
