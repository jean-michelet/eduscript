import ArrayType from '../../../semantic/types/ArrayType.js'
import Type from '../../../semantic/types/Type.js'
import TypeRef from '../../../semantic/types/TypeRef.js'
import AbstractNodeParser from '../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../Scanner/Token.js'
import AbstractNode, { AST_NODE_TYPE, NodeSourceContext } from '../AbstractNode.js'
import Identifier from './Identifier.js'

export type BuiltinType = 'number' | 'string' | 'boolean' | 'void' | 'null' | 'undefined'

export class TypeAnnotation extends AbstractNode {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.TYPE_ANNOTATION
  public readonly typedef: Type

  constructor (sourceContext: NodeSourceContext, typedef: Type) {
    super(sourceContext)
    this.typedef = typedef
  }

  static fromParser (parser: AbstractNodeParser): TypeAnnotation {
    parser.startParsing()
    parser.consume(TokenType.COLON)

    let type: Type
    if (parser.lookaheadHasType(TokenType.BUILTIN_TYPE)) {
      const lexeme = parser.consume(TokenType.BUILTIN_TYPE).lexeme as BuiltinType
      type = new Type(lexeme)
    } else {
      type = new TypeRef(Identifier.fromParser(parser))
    }

    if (parser.lookaheadHasType(TokenType.LEFT_BRACKET)) {
      parser.consume(TokenType.LEFT_BRACKET)

      type = new ArrayType(type)

      parser.consume(TokenType.RIGHT_BRACKET)
    }

    return new TypeAnnotation(parser.endParsing(), type)
  }
}
