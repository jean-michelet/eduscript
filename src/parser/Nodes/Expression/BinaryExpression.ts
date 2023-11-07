import Parser from '../../Parser/Parser.js'
import { TokenType } from '../../Scanner/Token.js'
import { AST_NODE_TYPE } from '../AstNode.js'
import Expression, { PrimaryExpression } from './Expression.js'

export type MathOperator = '+' | '-' | '/' | '*'
export type BinaryOperator = MathOperator

export default class BinaryExpression extends Expression {
  public readonly operator: BinaryOperator
  public readonly left
  public readonly right

  constructor (operator: BinaryOperator, left: Expression, right: Expression) {
    super(AST_NODE_TYPE.BINARY_EXPRESSION)
    this.operator = operator
    this.left = left
    this.right = right
  }

  static parse (parser: Parser, leftExpr: PrimaryExpression, precedence: number): PrimaryExpression {
    const currentPrecedence = BinaryExpression.precedence(parser.getLookahead().type)
    while (BinaryExpression.isOperator(parser.getLookahead().type)) {
      if (currentPrecedence < precedence) break

      const operator = parser.consume().lexeme as BinaryOperator

      const rightExpr = this.parse(parser, parser.primaryExpression(), currentPrecedence) as BinaryExpression

      leftExpr = new BinaryExpression(operator, leftExpr, rightExpr)
    }

    return leftExpr
  }

  static fromParser (parser: Parser, leftExpr: PrimaryExpression): PrimaryExpression {
    return this.parse(parser, leftExpr, 0)
  }

  static precedence (tokenType: TokenType): number {
    switch (tokenType) {
      case TokenType.MULTIPLICATIVE:
        return 5
      case TokenType.ADDITIVE:
        return 4
      case TokenType.GREATER_THAN:
      case TokenType.LESS_THAN:
      case TokenType.GREATER_EQUAL:
      case TokenType.LESS_EQUAL:
        return 3
      case TokenType.EQUAL:
      case TokenType.NOT_EQUAL:
        return 2
      case TokenType.NOT:
        return 6
      case TokenType.LOGICAL_AND:
        return 1
      case TokenType.LOGICAL_OR:
        return 0
      default:
        return -1
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
