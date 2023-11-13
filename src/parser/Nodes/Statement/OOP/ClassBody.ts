import AbstractNodeParser from '../../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../../Scanner/Token.js'
import { NodeSourceContext, AST_NODE_TYPE } from '../../AbstractNode.js'
import AbstractExpression from '../../Expression/AbstractExpression.js'
import Identifier from '../../Expression/Identifier.js'
import AbstractStatement from '../AbstractStatement.js'
import FunctionDeclaration from '../FunctionDeclaration.js'
import MethodDefinition from './MethodDefinition.js'
import PropertyDefinition from './PropertyDefinition.js'

export type ClassBodyStatement = MethodDefinition | PropertyDefinition

export enum CLASS_MEMBER_VISIBILITY {
  PUBLIC,
  PROTECTED,
  PRIVATE
}

export default class ClassBody extends AbstractStatement {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.CLASS_BODY
  public readonly statements: ClassBodyStatement[]

  constructor (sourceContext: NodeSourceContext, statements: ClassBodyStatement[]) {
    super(sourceContext)
    this.statements = statements
  }

  static fromParser (parser: AbstractNodeParser): ClassBody {
    parser.startParsing()
    parser.consume(TokenType.LEFT_CBRACE)

    const stmts: ClassBodyStatement[] = []
    while (!parser.eof() && !parser.lookaheadHasType(TokenType.RIGHT_CBRACE)) {
      stmts.push(this.parseStmt(parser))
    }

    parser.consume(TokenType.RIGHT_CBRACE)

    return new ClassBody(parser.endParsing(), stmts)
  }

  private static parseStmt (parser: AbstractNodeParser): ClassBodyStatement {
    parser.startParsing()

    let isStatic = false
    if (parser.lookaheadHasType(TokenType.STATIC)) {
      parser.consume(TokenType.STATIC)
      isStatic = true
    }

    const visibility = this.getMemberVisibility(parser)
    if (parser.lookaheadHasType(TokenType.FN)) {
      const fn = FunctionDeclaration.fromParser(parser)

      return new MethodDefinition(parser.endParsing(), fn.identifier, fn.params, fn.body, isStatic, visibility)
    }

    const id = Identifier.fromParser(parser)

    let init: AbstractExpression | null = null
    if (parser.lookaheadHasType(TokenType.ASSIGN)) {
      parser.consume(TokenType.ASSIGN)
      init = parser.expression()
    }

    parser.consume(TokenType.SEMI_COLON)

    return new PropertyDefinition(parser.endParsing(), id, init, isStatic, visibility)
  }

  private static getMemberVisibility (parser: AbstractNodeParser): CLASS_MEMBER_VISIBILITY {
    switch (parser.getLookahead().type) {
      case TokenType.PUBLIC:
        parser.consume(TokenType.PUBLIC)
        return CLASS_MEMBER_VISIBILITY.PUBLIC
      case TokenType.PROTECTED:
        parser.consume(TokenType.PROTECTED)
        return CLASS_MEMBER_VISIBILITY.PROTECTED
      case TokenType.PRIVATE:
        parser.consume(TokenType.PRIVATE)
        return CLASS_MEMBER_VISIBILITY.PRIVATE
      default:
        return CLASS_MEMBER_VISIBILITY.PUBLIC
    }
  }
}
