import { Context } from '../../Parser/ContextStack.js'
import AbstractNodeParser from '../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../Scanner/Token.js'
import { AST_NODE_TYPE } from '../AstNode.js'
import Expression from '../Expression/Expression.js'
import BlockStatement from './BlockStatement.js'
import Statement from './Statement.js'

export default class WhileStatement extends Statement {
  public readonly test: Expression
  public readonly consequent: BlockStatement

  constructor (test: Expression, consequent: BlockStatement) {
    super(AST_NODE_TYPE.WHILE_STATEMENT)
    this.test = test
    this.consequent = consequent
  }

  static fromParser (parser: AbstractNodeParser): WhileStatement {
    parser.consume(TokenType.WHILE)

    const test = parser.expression()

    parser.contextStack.enter(Context.LOOP)
    const consequent = BlockStatement.fromParser(parser)
    parser.contextStack.leave(Context.LOOP)

    return new WhileStatement(test, consequent)
  }
}
