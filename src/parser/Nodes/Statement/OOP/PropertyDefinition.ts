import Parser from '../../../Parser/Parser.js'
import { TokenType } from '../../../Scanner/Token.js'
import { AST_NODE_TYPE } from '../../AstNode.js'
import Expression from '../../Expression/Expression.js'
import Identifier from '../../Expression/Identifier.js'
import Statement from '../Statement.js'
import { CLASS_MEMBER_VISIBILITY } from './ClassBody.js'

export default class PropertyDefinition extends Statement {
  public readonly identifier: Identifier
  public readonly init: Expression | null
  public readonly isStatic: boolean
  public readonly visibility: CLASS_MEMBER_VISIBILITY

  constructor (
    id: Identifier,
    init: Expression | null,
    isStatic: boolean,
    visibility: CLASS_MEMBER_VISIBILITY
  ) {
    super(AST_NODE_TYPE.PROPERTY_DEFINITION)

    this.identifier = id
    this.init = init
    this.isStatic = isStatic
    this.visibility = visibility
  }

  static fromParser (parser: Parser, isStatic: boolean, visibility: CLASS_MEMBER_VISIBILITY): PropertyDefinition {
    const id = new Identifier(parser.consume(TokenType.IDENTIFIER).lexeme)
    let init: Expression | null = null

    if (parser.lookaheadHasType(TokenType.ASSIGN)) {
      parser.consume(TokenType.ASSIGN)
      init = parser.expression()
    }

    parser.consume(TokenType.SEMI_COLON)

    return new PropertyDefinition(id, init, isStatic, visibility)
  }
}
