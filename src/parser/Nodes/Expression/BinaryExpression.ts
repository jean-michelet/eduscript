import AbstractNodeParser from '../../Parser/AbstractNodeParser.js'
import { TokenType } from '../../Scanner/Token.js'
import { AST_NODE_TYPE } from '../AbstractNode.js'
import AbstractExpression, { PrimaryExpression } from './AbstractExpression.js'

export type MathOperator = '+' | '-' | '/' | '*'
export type RelationalOperator = '>' | '<' | '>=' | '<='
export type EqualityOperator = '==' | '!='
export type LogicalOperator = '&&' | '||'

export type BinaryOperator = MathOperator | RelationalOperator | EqualityOperator | LogicalOperator

export default class BinaryExpression extends AbstractExpression {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.BINARY_EXPRESSION
  public readonly operator: BinaryOperator
  public readonly left
  public readonly right

  constructor (operator: BinaryOperator, left: AbstractExpression, right: AbstractExpression) {
    super({
      startLine: left.sourceContext.startLine,
      endLine: right.sourceContext.endLine,
      startTokenPos: left.sourceContext.startTokenPos,
      endTokenPos: right.sourceContext.endTokenPos
    })

    this.operator = operator
    this.left = left
    this.right = right
  }

  static fromParser (parser: AbstractNodeParser, precedence = 0): PrimaryExpression | BinaryExpression {
    let leftExpr: PrimaryExpression | BinaryExpression = parser.primaryExpression()

    while (BinaryExpression.isOperator(parser.getLookahead().type)) {
      const currentPrecedence = BinaryExpression.precedence(parser.getLookahead().type)
      if (currentPrecedence <= precedence) break

      const operator = parser.consume().lexeme as BinaryOperator
      const rightExpr = BinaryExpression.fromParser(parser, currentPrecedence) as BinaryExpression

      leftExpr = new BinaryExpression(operator, leftExpr, rightExpr)
    }

    return leftExpr
  }

  static precedence (tokenType: TokenType): number {
    switch (tokenType) {
      case TokenType.MULTIPLICATIVE:
        return 7
      case TokenType.ADDITIVE:
        return 6
      case TokenType.GREATER_THAN:
      case TokenType.LESS_THAN:
      case TokenType.GREATER_EQUAL:
      case TokenType.LESS_EQUAL:
        return 5
      case TokenType.EQUAL:
      case TokenType.NOT_EQUAL:
        return 4
      case TokenType.NOT:
        return 3
      case TokenType.LOGICAL_AND:
        return 2
      case TokenType.LOGICAL_OR:
        return 1
      default:
        return 0
    }
  }

  static isOperator (tokenType: TokenType): boolean {
    switch (tokenType) {
      case TokenType.ADDITIVE:
      case TokenType.MULTIPLICATIVE:
      case TokenType.EQUAL:
      case TokenType.NOT:
      case TokenType.NOT_EQUAL:
      case TokenType.GREATER_THAN:
      case TokenType.LESS_THAN:
      case TokenType.GREATER_EQUAL:
      case TokenType.LESS_EQUAL:
      case TokenType.LOGICAL_AND:
      case TokenType.LOGICAL_OR:
        return true
      default:
        return false
    }
  }
}
