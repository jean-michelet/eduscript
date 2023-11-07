import { Context } from '../Parser/ContextStack.js'
import Parser from '../Parser/Parser.js'
import AstNode, { AST_NODE_TYPE } from './AstNode.js'
import BlockStatement from './Statement/BlockStatement.js'
import Statement from './Statement/Statement.js'

export default class Program extends AstNode {
  public readonly body: BlockStatement

  constructor (body: BlockStatement) {
    super(AST_NODE_TYPE.PROGRAM)

    this.body = body
  }

  static fromParser (parser: Parser): Program {
    parser.contextStack.enter(Context.TOP)

    let statements: Statement[] = []
    if (!parser.eof()) {
      statements = parser.statements()
    }

    parser.contextStack.leave(Context.TOP)

    return new Program(new BlockStatement(statements))
  }
}
