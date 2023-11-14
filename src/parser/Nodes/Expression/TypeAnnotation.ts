import AbstractNodeParser from '../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../Scanner/Token.js'
import AbstractNode, { AST_NODE_TYPE, NodeSourceContext } from '../AbstractNode.js'
import Identifier from './Identifier.js'

export type BuiltinType = 'number' | 'string' | 'boolean' | 'void' | 'null' | 'undefined'

export class TypeAnnotation extends AbstractNode {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.TYPE_ANNOTATION
  public readonly typedef: BuiltinType | Identifier

  constructor (sourceContext: NodeSourceContext, typedef: BuiltinType | Identifier) {
    super(sourceContext)
    this.typedef = typedef
  }

  static fromParser (parser: AbstractNodeParser): TypeAnnotation {
    parser.startParsing()
    parser.consume(TokenType.COLON)

    if (parser.lookaheadHasType(TokenType.BUILTIN_TYPE)) {
      const type = parser.consume(TokenType.BUILTIN_TYPE).lexeme as BuiltinType
      return new TypeAnnotation(parser.endParsing(), type)
    }

    return new TypeAnnotation(parser.endParsing(), Identifier.fromParser(parser))
  }
}
