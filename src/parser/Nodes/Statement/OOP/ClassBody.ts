import AbstractNodeParser from '../../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../../Scanner/Token.js'
import { NodeAttributes } from '../../AbstractNode.js'
import { AST_NODE_TYPE } from '../../AstNode.js'
import AbstractStatement from '../AbstractStatement.js'
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

  constructor (attributes: NodeAttributes, statements: ClassBodyStatement[]) {
    super(attributes)
    this.statements = statements
  }

  static fromParser (parser: AbstractNodeParser): ClassBody {
    parser.consume(TokenType.LEFT_CBRACE)

    const stmts: ClassBodyStatement[] = []
    while (!parser.eof() && !parser.lookaheadHasType(TokenType.RIGHT_CBRACE)) {
      stmts.push(this.parseStmt(parser))
    }

    parser.consume(TokenType.RIGHT_CBRACE)

    return new ClassBody(parser.endParsing(), stmts)
  }

  private static parseStmt (parser: AbstractNodeParser): ClassBodyStatement {
    let isStatic = false
    if (parser.lookaheadHasType(TokenType.STATIC)) {
      parser.consume(TokenType.STATIC)
      isStatic = true
    }

    const visibility = this.getMemberVisibility(parser)
    if (parser.lookaheadHasType(TokenType.FN)) {
      return MethodDefinition.fromParser(parser, isStatic, visibility)
    }

    return PropertyDefinition.fromParser(parser, isStatic, visibility)
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
