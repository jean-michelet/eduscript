import AbstractNodeParser from '../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../Scanner/Token.js'
import { NodeSourceContext, AST_NODE_TYPE } from '../AbstractNode.js'
import AbstractExpression from '../Expression/AbstractExpression.js'
import Identifier from '../Expression/Identifier.js'
import { TypeAnnotation } from '../Expression/TypeAnnotation.js'
import AbstractStatement from './AbstractStatement.js'

export type VariableKind = 'let' | 'const'

export default class VariableDeclaration extends AbstractStatement {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.VARIABLE_DECLARATION
  public readonly kind: VariableKind
  public readonly typeAnnotation: TypeAnnotation
  public readonly identifier: Identifier
  public readonly init: AbstractExpression | null

  constructor (sourceContext: NodeSourceContext, kind: VariableKind, typeAnnotation: TypeAnnotation, identifier: Identifier, init: AbstractExpression | null) {
    super(sourceContext)
    this.kind = kind
    this.typeAnnotation = typeAnnotation
    this.identifier = identifier
    this.init = init
  }

  static fromParser (parser: AbstractNodeParser): VariableDeclaration {
    parser.startParsing()
    const kind = parser.consume().lexeme as VariableKind
    const identifier = Identifier.fromParser(parser)
    const typeAnnotation = TypeAnnotation.fromParser(parser)
    let init: AbstractExpression | null = null

    if (!parser.lookaheadHasType(TokenType.SEMI_COLON)) {
      parser.consume(TokenType.ASSIGN)
      init = parser.expression()
    }

    parser.consume(TokenType.SEMI_COLON)

    return new VariableDeclaration(parser.endParsing(), kind, typeAnnotation, identifier, init)
  }
}
