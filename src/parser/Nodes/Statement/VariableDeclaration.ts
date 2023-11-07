import Parser from '../../Parser/Parser.js'
import { TokenType } from '../../Scanner/Token.js'
import { AST_NODE_TYPE } from '../AstNode.js'
import Expression from '../Expression/Expression.js'
import Identifier from '../Expression/Identifier.js'
import { TypeAnnotation } from '../Expression/TypeAnnotation.js'
import Statement from './Statement.js'

export type VariableKind = 'let' | 'const'

export default class VariableDeclaration extends Statement {
  public readonly kind: VariableKind
  public readonly typeAnnotation: TypeAnnotation
  public readonly identifier: Identifier
  public readonly init: Expression | null

  constructor (kind: VariableKind, typeAnnotation: TypeAnnotation, identifier: Identifier, init: Expression | null) {
    super(AST_NODE_TYPE.VARIABLE_DECLARATION)
    this.kind = kind
    this.typeAnnotation = typeAnnotation
    this.identifier = identifier
    this.init = init
  }

  static fromParser (parser: Parser): VariableDeclaration {
    const kind = parser.consume().lexeme as VariableKind
    const identifier = new Identifier(parser.consume(TokenType.IDENTIFIER).lexeme)
    const typeAnnotation = TypeAnnotation.fromParser(parser)
    let init: Expression | null = null

    if (!parser.lookaheadHasType(TokenType.SEMI_COLON)) {
      parser.consume(TokenType.ASSIGN)
      init = parser.expression()
    } else if (kind === 'const') {
      throw new SyntaxError('const declaration must be initialized.')
    }

    parser.consume(TokenType.SEMI_COLON)

    return new VariableDeclaration(kind, typeAnnotation, identifier, init)
  }
}
