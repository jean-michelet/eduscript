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

    const token = parser.consume()
    switch (token.type) {
      case TokenType.BUILTIN_TYPE:
        return new TypeAnnotation(token.lexeme as BuiltinType)
      case TokenType.IDENTIFIER:
        return new TypeAnnotation(new Identifier(token.lexeme as BuiltinType))
      default:
        throw new SyntaxError(`Expected type or identifier, but found '${token.lexeme}' at line ${token.line}.`)
    }
  }
}
