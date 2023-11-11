import { Context } from '../Parser/ContextStack.js'
import AbstractNodeParser from '../Parser/AbstractNodeParser.js'
import { AST_NODE_TYPE } from './AstNode.js'
import BlockStatement from './Statement/BlockStatement.js'
import AbstractNode, { NodeAttributes } from './AbstractNode.js'
import AbstractStatement from './Statement/AbstractStatement.js'

export default class Program extends AbstractNode {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.PROGRAM
  public readonly body: BlockStatement

  constructor (attributes: NodeAttributes, body: BlockStatement) {
    super(attributes)
    this.body = body
  }

  static fromParser (parser: AbstractNodeParser): Program {
    parser.startParsing()
    parser.contextStack.enter(Context.TOP)

    parser.startParsing()
    let statements: AbstractStatement[] = []
    if (!parser.eof()) {
      statements = parser.statements()
    }

    const block = new BlockStatement(parser.endParsing(), statements)

    parser.contextStack.leave(Context.TOP)

    return new Program(parser.endParsing(), block)
  }
}
