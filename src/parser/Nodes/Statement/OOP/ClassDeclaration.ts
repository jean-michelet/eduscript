import { NodeParser } from '../../../Parser/Parser.js'
import { TokenType } from '../../../Scanner/Token.js'
import { AST_NODE_TYPE } from '../../AstNode.js'
import Identifier from '../../Expression/Identifier.js'
import Statement from '../Statement.js'
import ClassBody from './ClassBody.js'

export default class ClassDeclaration extends Statement {
  public readonly parent: Identifier | null
  public readonly identifier: Identifier
  public readonly body: ClassBody

  constructor (identifier: Identifier, body: ClassBody, parent: Identifier | null = null) {
    super(AST_NODE_TYPE.CLASS_DECLARATION)
    this.identifier = identifier
    this.parent = parent
    this.body = body
  }

  static fromParser (parser: NodeParser): ClassDeclaration {
    parser.consume(TokenType.CLASS)
    const identifier = new Identifier(parser.consume(TokenType.IDENTIFIER).lexeme)

    let parent: Identifier | null = null
    if (parser.lookaheadHasType(TokenType.EXTENDS)) {
      parser.consume(TokenType.EXTENDS)
      parent = new Identifier(parser.consume(TokenType.IDENTIFIER).lexeme)
    }

    return new ClassDeclaration(identifier, ClassBody.fromParser(parser), parent)
  }
}
