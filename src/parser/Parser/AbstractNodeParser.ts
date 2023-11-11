import { NodeSourceContext } from '../Nodes/AbstractNode.js'
import ArrayAccessExpression from '../Nodes/Expression/ArrayAccessExpression.js'
import ArrayExpression from '../Nodes/Expression/ArrayExpression.js'
import AssignmentExpression, { AssignmentOperator } from '../Nodes/Expression/AssignmentExpression.js'
import BinaryExpression from '../Nodes/Expression/BinaryExpression.js'
import CallExpression from '../Nodes/Expression/CallExpression.js'
import Expression, { PrimaryExpression } from '../Nodes/Expression/Expression.js'
import Identifier from '../Nodes/Expression/Identifier.js'
import LeftHandSideExpression from '../Nodes/Expression/LeftHandSideExpression.js'
import LiteralExpression from '../Nodes/Expression/LiteralExpression.js'
import MemberExpression from '../Nodes/Expression/MemberExpression.js'
import Program from '../Nodes/Program.js'
import AbstractStatement from '../Nodes/Statement/AbstractStatement.js'
import BlockStatement from '../Nodes/Statement/BlockStatement.js'
import EmptyStatement from '../Nodes/Statement/EmptyStatement.js'
import ExpressionStatement from '../Nodes/Statement/ExpressionStatement.js'
import FunctionDeclaration from '../Nodes/Statement/FunctionDeclaration.js'
import IfStatement from '../Nodes/Statement/IfStatement.js'
import ImportStatement from '../Nodes/Statement/ImportStatement.js'
import BreakStatement from '../Nodes/Statement/JumpStatement/BreakStatement.js'
import ContinueStatement from '../Nodes/Statement/JumpStatement/ContinueStatement.js'
import ReturnStatement from '../Nodes/Statement/JumpStatement/ReturnStatement.js'
import ClassDeclaration from '../Nodes/Statement/OOP/ClassDeclaration.js'
import VariableDeclaration from '../Nodes/Statement/VariableDeclaration.js'
import WhileStatement from '../Nodes/Statement/WhileStatement.js'
import { ScannerInterface } from '../Scanner/Scanner.js'
import { Token, TokenType } from '../Scanner/Token.js'
import ContextStack, { Context } from '../ContextStack/ContextStack.js'
import ParsingSequenceError from './errors/ParsingSequenceError.js'

export default abstract class AbstractNodeParser {
  private _prevLookahead: Token
  public lookahead: Token
  public readonly contextStack: ContextStack = new ContextStack()
  private readonly _scanner: ScannerInterface
  private _tokenStack: Token[] = []

  constructor (scanner: ScannerInterface) {
    this._scanner = scanner
    this.lookahead = this._prevLookahead = {
      type: TokenType.EOF,
      lexeme: '',
      value: null,
      startLine: 0,
      endLine: 0,
      startPos: 0,
      endPos: 0
    }
  }

  parse (input: string): Program {
    this._scanner.init(input)
    this.lookahead = this._prevLookahead = this._scanner.scanToken()
    this._tokenStack = []

    const program = Program.fromParser(this)

    if (this._tokenStack.length > 0) {
      throw new RangeError(`Parsing completed with ${this._tokenStack.length} unmatched tokens in the stack. This usually indicates an imbalance in the usage of 'AbstractNodeParser::startParsing' and 'AbstractNodeParser::endParsing' methods, suggesting that the source code might have unmatched or missing delimiters (like '{' without a corresponding '}'.`)
    }

    return program
  }

  public statements (): AbstractStatement[] {
    const stmts: AbstractStatement[] = [this.statement()]
    while (
      !this.eof() &&
        this.lookahead.type !== TokenType.RIGHT_CBRACE
    ) {
      stmts.push(this.statement())
    }

    return stmts
  }

  public statement (): AbstractStatement {
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

    return ExpressionStatement.fromParser(this)
  }

  public breakLoopStatement (): BreakStatement | ContinueStatement {
    this.startParsing()
    const type = this.consume(this.getLookahead().type).type
    if (!this.contextStack.isCurrentContext(Context.LOOP)) {
      throw new SyntaxError(`Illegal "${type.toLowerCase()}" statement.`)
    }

    let number: number | null = null
    if (this.lookaheadHasType(TokenType.NUMBER)) {
      number = this.consume(TokenType.NUMBER).value as number
    }

    const stmt = type === TokenType.BREAK ? new BreakStatement(this.endParsing(), number) : new ContinueStatement(this.endParsing(), number)

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
            `Unexpected token '${this.getLookahead().lexeme}' at line ${this.getLookahead().startLine
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
          }' at line ${this.getLookahead()?.startLine}.`
      )
    }

    this._prevLookahead = this.getLookahead()

    this.lookahead = this._scanner.scanToken()

    return this._prevLookahead
  }

  public startParsing (): void {
    this._tokenStack.push(this.lookahead)
  }

  public endParsing (): NodeSourceContext {
    const startToken = this._tokenStack.pop()
    if (startToken == null) {
      throw new ParsingSequenceError(`
        AbstractNodeParser::endParsing was called without a matching call to AbstractNodeParser::startParsing.
        This typically indicates that the parsing process was initiated without a proper opening context. 
        Ensure that 'startParsing' is called before 'endParsing' is invoked.
      `)
    }

    return {
      startLine: startToken.startLine,
      endLine: this._prevLookahead.endLine,
      startTokenPos: startToken.startPos,
      endTokenPos: this._prevLookahead.endPos
    }
  }

  public eof (): boolean {
    return this.lookaheadHasType(TokenType.EOF)
  }

  public getLookahead (): Token {
    if (this.lookaheadHasType(TokenType.EOF)) {
      throw new SyntaxError('Unexpected end of line.')
    }

    return this.lookahead
  }

  public lookaheadHasType (tokenType: TokenType): boolean {
    return this.lookahead.type === tokenType
  }
}
