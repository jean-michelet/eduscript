import { Context } from '../../ContextStack/ContextStack.js'
import AbstractNodeParser from '../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../Scanner/Token.js'
import { AST_NODE_TYPE } from '../AstNode.js'
import AssignmentPattern from '../Expression/AssignmentPattern.js'
import Identifier from '../Expression/Identifier.js'
import BlockStatement from './BlockStatement.js'
import AbstractStatement from './AbstractStatement.js'
import { NodeSourceContext } from '../AbstractNode.js'

export default class FunctionDeclaration extends AbstractStatement {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.FUNCTION_DECLARATION
  public readonly identifier: Identifier
  public readonly params: Array<Identifier | AssignmentPattern>
  public readonly body: BlockStatement

  constructor (sourceContext: NodeSourceContext, identifier: Identifier, params: Array<Identifier | AssignmentPattern>, body: BlockStatement) {
    super(sourceContext)
    this.identifier = identifier
    this.params = params
    this.body = body
  }

  static fromParser (parser: AbstractNodeParser): FunctionDeclaration {
    parser.startParsing()
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

    return new FunctionDeclaration(parser.endParsing(), identifier, params, body)
  }
}
