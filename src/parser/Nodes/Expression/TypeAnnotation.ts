import AbstractNodeParser from '../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../Scanner/Token.js'
import AstNode, { AST_NODE_TYPE } from '../AstNode.js'
import Identifier from './Identifier.js'

export type BuiltinType = 'number' | 'string' | 'boolean' | 'void' | 'null'

export class TypeAnnotation extends AstNode {
  public readonly typedef: BuiltinType | Identifier

  constructor (typedef: BuiltinType | Identifier) {
    super(AST_NODE_TYPE.TYPE_ANNOTATION)
    this.typedef = typedef
  }

  static fromParser (parser: AbstractNodeParser): TypeAnnotation {
    parser.consume(TokenType.COLON)

    if (parser.lookaheadHasType(TokenType.BUILTIN_TYPE)) {
      const type = parser.consume(TokenType.BUILTIN_TYPE).lexeme as BuiltinType
      return new TypeAnnotation(type)
    }

    return new TypeAnnotation(Identifier.fromParser(parser))
  }
}
