import { Context } from '../../Parser/ContextStack.js'
import Parser from '../../Parser/Parser.js'
import { TokenType } from '../../Scanner/Token.js'
import { AST_NODE_TYPE } from '../AstNode.js'
import Expression from '../Expression/Expression.js'
import BlockStatement from './BlockStatement.js'
import Statement from './Statement.js'

export default class WhileStatement extends Statement {
  public readonly test: Expression
  public readonly body: BlockStatement

  constructor (test: Expression, body: BlockStatement) {
    super(AST_NODE_TYPE.WHILE_STATEMENT)
    this.test = test
    this.body = body
  }

  static fromParser (parser: Parser): WhileStatement {
    parser.consume(TokenType.WHILE)

    const test = parser.expression()

    parser.contextStack.enter(Context.LOOP)
    const consequent = BlockStatement.fromParser(parser)
    parser.contextStack.leave(Context.LOOP)

    return new WhileStatement(test, consequent)
  }
}
