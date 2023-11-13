import { Context } from '../../../ContextStack/ContextStack.js'
import AbstractNodeParser from '../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../Scanner/Token.js'
import { AST_NODE_TYPE, NodeSourceContext } from '../AbstractNode.js'
import BlockStatement from './BlockStatement.js'
import AbstractStatement from './AbstractStatement.js'
import AbstractExpression from '../Expression/AbstractExpression.js'

export default class WhileStatement extends AbstractStatement {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.WHILE_STATEMENT
  public readonly test: AbstractExpression
  public readonly consequent: BlockStatement

  constructor (sourceContext: NodeSourceContext, test: AbstractExpression, consequent: BlockStatement) {
    super(sourceContext)
    this.test = test
    this.consequent = consequent
  }

  static fromParser (parser: AbstractNodeParser): WhileStatement {
    parser.startParsing()
    parser.consume(TokenType.WHILE)

    const test = parser.expression()

    parser.contextStack.enter(Context.LOOP)
    const consequent = BlockStatement.fromParser(parser)
    parser.contextStack.leave(Context.LOOP)

    return new WhileStatement(parser.endParsing(), test, consequent)
  }
}
