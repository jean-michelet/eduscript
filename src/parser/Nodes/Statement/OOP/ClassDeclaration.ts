import AbstractNodeParser from '../../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../../Scanner/Token.js'
import { NodeSourceContext, AST_NODE_TYPE } from '../../AbstractNode.js'
import Identifier from '../../Expression/Identifier.js'
import AbstractStatement from '../AbstractStatement.js'
import ClassBody from './ClassBody.js'

export default class ClassDeclaration extends AbstractStatement {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.CLASS_DECLARATION
  public readonly parent: Identifier | null
  public readonly identifier: Identifier
  public readonly body: ClassBody

  constructor (sourceContext: NodeSourceContext, identifier: Identifier, body: ClassBody, parent: Identifier | null = null) {
    super(sourceContext)
    this.identifier = identifier
    this.parent = parent
    this.body = body
  }

  static fromParser (parser: AbstractNodeParser): ClassDeclaration {
    parser.startParsing()
    parser.consume(TokenType.CLASS)
    const identifier = Identifier.fromParser(parser)

    let parent: Identifier | null = null
    if (parser.lookaheadHasType(TokenType.EXTENDS)) {
      parser.consume(TokenType.EXTENDS)
      parent = Identifier.fromParser(parser)
    }

    const body = ClassBody.fromParser(parser)

    return new ClassDeclaration(parser.endParsing(), identifier, body, parent)
  }
}
