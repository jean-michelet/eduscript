import { Context } from '../../../ContextStack/ContextStack.js'
import AbstractNodeParser from '../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../Scanner/Token.js'
import { AST_NODE_TYPE, NodeSourceContext } from '../AbstractNode.js'
import AssignmentPattern from '../Expression/AssignmentPattern.js'
import Identifier from '../Expression/Identifier.js'
import BlockStatement from './BlockStatement.js'
import AbstractStatement from './AbstractStatement.js'
import { TypeAnnotation } from '../Expression/TypeAnnotation.js'

export class FunctionParameter {
  public readonly expr: Identifier | AssignmentPattern
  public readonly type: TypeAnnotation

  constructor (expr: Identifier | AssignmentPattern, type: TypeAnnotation) {
    this.expr = expr
    this.type = type
  }
}

export default class FunctionDeclaration extends AbstractStatement {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.FUNCTION_DECLARATION
  public readonly identifier: Identifier
  public readonly params: FunctionParameter[]
  public readonly body: BlockStatement

  constructor (sourceContext: NodeSourceContext, identifier: Identifier, params: FunctionParameter[], body: BlockStatement) {
    super(sourceContext)
    this.identifier = identifier
    this.params = params
    this.body = body
  }

  static fromParser (parser: AbstractNodeParser): FunctionDeclaration {
    parser.startParsing()
    parser.consume(TokenType.FN)
    const identifier = Identifier.fromParser(parser)

    const params: FunctionParameter[] = []
    while (!parser.lookaheadHasType(TokenType.LEFT_CBRACE)) {
      parser.startParsing()
      let expr: Identifier | AssignmentPattern = Identifier.fromParser(parser)
      const type = TypeAnnotation.fromParser(parser)

      if (parser.lookaheadHasType(TokenType.ASSIGN)) {
        parser.consume(TokenType.ASSIGN)
        expr = new AssignmentPattern(parser.endParsing(), expr, parser.expression())
      } else {
        parser.endParsing()
      }

      params.push(new FunctionParameter(expr, type))

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
