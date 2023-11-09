import AssignmentExpression, { AssignmentOperator } from '../Nodes/Expression/AssignmentExpression.js'
import LeftHandSideExpression from '../Nodes/Expression/LeftHandSideExpression.js'
import Program from '../Nodes/Program.js'
import FunctionDeclaration from '../Nodes/Statement/FunctionDeclaration.js'
import IfStatement from '../Nodes/Statement/IfStatement.js'
import ReturnStatement from '../Nodes/Statement/JumpStatement/ReturnStatement.js'
import WhileStatement from '../Nodes/Statement/WhileStatement.js'
import { ScannerInterface } from '../Scanner/Scanner.js'
import { Token, TokenType } from '../Scanner/Token.js'
import ContextStack, { Context } from './ContextStack.js'
import ContinueStatement from '../Nodes/Statement/JumpStatement/ContinueStatement.js'
import ImportStatement from '../Nodes/Statement/ImportStatement.js'
import ClassDeclaration from '../Nodes/Statement/OOP/ClassDeclaration.js'
import CallExpression from '../Nodes/Expression/CallExpression.js'
import MemberExpression from '../Nodes/Expression/MemberExpression.js'
import ArrayExpression from '../Nodes/Expression/ArrayExpression.js'
import ArrayAccessExpression from '../Nodes/Expression/ArrayAccessExpression.js'
import BreakStatement from '../Nodes/Statement/JumpStatement/BreakStatement.js'
import Statement from '../Nodes/Statement/Statement.js'
import BlockStatement from '../Nodes/Statement/BlockStatement.js'
import VariableDeclaration from '../Nodes/Statement/VariableDeclaration.js'
import EmptyStatement from '../Nodes/Statement/EmptyStatement.js'
import ExpressionStatement from '../Nodes/Statement/ExpressionStatement.js'
import Expression, { PrimaryExpression } from '../Nodes/Expression/Expression.js'
import BinaryExpression from '../Nodes/Expression/BinaryExpression.js'
import LiteralExpression from '../Nodes/Expression/LiteralExpression.js'
import Identifier from '../Nodes/Expression/Identifier.js'

export default class Parser {
  private readonly nodeParser: NodeParser

  constructor (scanner: ScannerInterface) {
    this.nodeParser = new NodeParser(scanner)
  }

  public parse (input: string): Program {
    return this.nodeParser.parse(input)
  }
}

export class NodeParser {
  private readonly _scanner: ScannerInterface
  public lookahead: Token
  public readonly contextStack: ContextStack = new ContextStack()

  constructor (scanner: ScannerInterface) {
    this._scanner = scanner
    this.lookahead = {
      type: TokenType.EOF,
      lexeme: '',
      value: null,
      line: 0
    }
  }

  parse (input: string): Program {
    this._scanner.init(input)
    this.lookahead = this._scanner.scanToken()

    return Program.fromParser(this)
  }

  public statements (): Statement[] {
    const stmts: Statement[] = [this.statement()]
    while (
      !this.eof() &&
      this.lookahead.type !== TokenType.RIGHT_CBRACE
    ) {
      stmts.push(this.statement())
    }

    return stmts
  }

  public statement (): Statement {
    switch (this.getLookahead().type) {
      case TokenType.LEFT_CBRACE: {
        return BlockStatement.fromParser(this)
      }

      case TokenType.LET:
      case TokenType.CONST: {
        return VariableDeclaration.fromParser(this)
      }

      case TokenType.FN: {
        return FunctionDeclaration.fromParser(this)
      }

      case TokenType.IF: {
        return IfStatement.fromParser(this)
      }

      case TokenType.WHILE: {
        return WhileStatement.fromParser(this)
      }

      case TokenType.RETURN: {
        return ReturnStatement.fromParser(this)
      }

      case TokenType.BREAK:
      case TokenType.CONTINUE: {
        return this.breakLoopStatement()
      }

      case TokenType.IMPORT: {
        return ImportStatement.fromParser(this)
      }

      case TokenType.CLASS: {
        return ClassDeclaration.fromParser(this)
      }

      case TokenType.SEMI_COLON: {
        return EmptyStatement.fromParser(this)
      }
    }

    const expression = this.expression()
    this.consume(TokenType.SEMI_COLON)

    return new ExpressionStatement(expression)
  }

  public breakLoopStatement (): BreakStatement | ContinueStatement {
    const type = this.consume(this.getLookahead().type).type
    if (!this.contextStack.hasDirectParent(Context.LOOP)) {
      throw new SyntaxError(`Illegal "${type.toLowerCase()}" statement.`)
    }

    let number: number | null = null
    if (this.lookaheadHasType(TokenType.NUMBER)) {
      number = this.consume(TokenType.NUMBER).value as number
    }

    const stmt = type === TokenType.BREAK ? new BreakStatement(number) : new ContinueStatement(number)

    this.consume(TokenType.SEMI_COLON)

    return stmt
  }

  public expression (): Expression {
    const expr = this.primaryExpression()

    if (BinaryExpression.isOperator(this.getLookahead().type)) {
      return BinaryExpression.fromParser(this, expr)
    }

    return expr
  }

  public primaryExpression (): PrimaryExpression {
    const tokenType = this.getLookahead().type
    switch (tokenType) {
      case TokenType.NUMBER:
      case TokenType.STRING:
      case TokenType.BOOLEAN: {
        return LiteralExpression.fromParser(this)
      }

      case TokenType.IDENTIFIER: {
        return this.leftHandSideExpression()
      }

      case TokenType.LEFT_BRACKET: {
        return ArrayExpression.fromParser(this)
      }

      case TokenType.LEFT_PAREN: {
        this.consume(TokenType.LEFT_PAREN)
        const expr = this.expression()
        this.consume(TokenType.RIGHT_PAREN)
        return expr
      }

      default:
        throw new SyntaxError(
          `Unexpected token '${this.getLookahead().lexeme}' at line ${this.getLookahead().line
          }.`
        )
    }
  }

  public leftHandSideExpression (): LeftHandSideExpression {
    const name = this.consume(TokenType.IDENTIFIER).lexeme

    if (this.lookaheadHasType(TokenType.ASSIGN)) {
      const operator = this.consume(TokenType.ASSIGN).lexeme as AssignmentOperator

      return new AssignmentExpression(operator, new Identifier(name), this.expression())
    }

    const id = new Identifier(name)
    if (this.lookaheadHasType(TokenType.LEFT_BRACKET)) {
      return ArrayAccessExpression.fromParser(this, id)
    }

    let callee: Identifier | MemberExpression = id
    if (this.lookaheadHasType(TokenType.DOT)) {
      callee = MemberExpression.fromParser(this, callee)
    }

    if (this.lookaheadHasType(TokenType.LEFT_PAREN)) {
      return CallExpression.fromParser(this, callee)
    }

    return callee
  }

  public consume (expectedType: TokenType | null = null): Token {
    if (expectedType && !this.lookaheadHasType(expectedType)) {
      throw new SyntaxError(
        `Expected token '${expectedType}', but found '${this.getLookahead()?.lexeme
        }' at line ${this.getLookahead()?.line}.`
      )
    }

    const prevLookahed = this.getLookahead()

    this.lookahead = this._scanner.scanToken()

    return prevLookahed
  }

  public eof (): boolean {
    return this.lookaheadHasType(TokenType.EOF)
  }

  public getLookahead (): Token {
    if (this.lookaheadHasType(TokenType.EOF)) {
      throw new Error('Unexpected end of line.')
    }

    return this.lookahead
  }

  public lookaheadHasType (tokenType: TokenType): boolean {
    return this.lookahead.type === tokenType
  }
}
