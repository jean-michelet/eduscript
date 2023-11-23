import { Context } from '../../ContextStack/ContextStack.js'
import AbstractNodeParser from '../Parser/AbstractNodeParser.js'
import AbstractNode, { AST_NODE_TYPE, NodeSourceContext } from './AbstractNode.js'
import BlockStatement from './Statement/BlockStatement.js'
import AbstractStatement from './Statement/AbstractStatement.js'
import SourceFileManager from '../../scanner/SourceFileManager/SourceFileManager.js'

export default class Program extends AbstractNode {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.PROGRAM
  public readonly body: BlockStatement
  public readonly source: SourceFileManager

  constructor (sourceContext: NodeSourceContext, source: SourceFileManager, body: BlockStatement) {
    super(sourceContext)
    this.body = body
    this.source = source
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

    return new Program(parser.endParsing(), parser.source, block)
  }
}
