import { Context } from '../../Parser/ContextStack.js'
import AbstractNodeParser from '../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../Scanner/Token.js'
import { AST_NODE_TYPE } from '../AstNode.js'
import AssignmentPattern from '../Expression/AssignmentPattern.js'
import Identifier from '../Expression/Identifier.js'
import BlockStatement from './BlockStatement.js'
import Statement from './Statement.js'

export default class FunctionDeclaration extends Statement {
  public readonly identifier: Identifier
  public readonly params: Array<Identifier | AssignmentPattern>
  public readonly body: BlockStatement

  constructor (identifier: Identifier, params: Array<Identifier | AssignmentPattern>, body: BlockStatement) {
    super(AST_NODE_TYPE.FUNCTION_DECLARATION)
    this.identifier = identifier
    this.params = params
    this.body = body
  }

  static fromParser (parser: AbstractNodeParser): FunctionDeclaration {
    parser.consume(TokenType.FN)
    const identifier = new Identifier(parser.consume(TokenType.IDENTIFIER).lexeme)

    const params: Array<Identifier | AssignmentPattern> = []
    while (!parser.lookaheadHasType(TokenType.LEFT_CBRACE)) {
      const identifier = new Identifier(parser.consume(TokenType.IDENTIFIER).lexeme)

      if (parser.lookaheadHasType(TokenType.ASSIGN)) {
        parser.consume(TokenType.ASSIGN)
        params.push(new AssignmentPattern(identifier, parser.expression()))
      } else {
        params.push(identifier)
      }

      if (!parser.lookaheadHasType(TokenType.COMA)) {
        break
      }

      parser.consume(TokenType.COMA)
    }

    parser.contextStack.enter(Context.FUNCTION)
    const body = BlockStatement.fromParser(parser)
    parser.contextStack.leave(Context.FUNCTION)

    return new FunctionDeclaration(identifier, params, body)
  }
}
