import { NodeSourceContext } from '../Nodes/AbstractNode.js'
import ArrayAccessExpression from '../Nodes/Expression/ArrayAccessExpression.js'
import ArrayExpression from '../Nodes/Expression/ArrayExpression.js'
import AssignmentExpression from '../Nodes/Expression/AssignmentExpression.js'
import BinaryExpression from '../Nodes/Expression/BinaryExpression.js'
import CallExpression from '../Nodes/Expression/CallExpression.js'
import Identifier from '../Nodes/Expression/Identifier.js'
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
import { ScannerInterface } from '../../scanner/Scanner/Scanner.js'
import { Token, TokenType } from '../../scanner/Token.js'
import ContextStack, { Context } from '../../ContextStack/ContextStack.js'
import ParsingSequenceError from './errors/ParsingSequenceError.js'
import AbstractExpression, { LeftHandSideExpression, PrimaryExpression } from '../Nodes/Expression/AbstractExpression.js'
import ParenthesizedExpression from '../Nodes/Expression/ParenthesizedExpression.js'
import NewExpression from '../Nodes/Expression/NewExpression.js'
import SourceFileManager from '../../scanner/SourceFileManager/SourceFileManager.js'
import Type, { BuiltinType } from '../../semantic/types/Type.js'
import ArrayType from '../../semantic/types/ArrayType.js'
import TypeRef from '../../semantic/types/TypeRef.js'

export default abstract class AbstractNodeParser {
  private _prevLookahead: Token
  private _tokens: Token[] = []
  private _parsingContext: Token[] = []
  public lookahead: Token
  public source: SourceFileManager

  public readonly contextStack: ContextStack = new ContextStack()
  private readonly _scanner: ScannerInterface

  constructor (scanner: ScannerInterface) {
    this._scanner = scanner
    this.source = scanner.getSource()
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
    this.source = this._scanner.getSource()
    this._tokens = this._scanner.scan()
    this.lookahead = this._prevLookahead = this.getNextToken()
    this._parsingContext = []

    const program = Program.fromParser(this)

    if (this._parsingContext.length > 0) {
      throw new RangeError(`Parsing completed with ${this._parsingContext.length} unmatched tokens in the stack. This usually indicates an imbalance in the usage of 'AbstractNodeParser::startParsing' and 'AbstractNodeParser::endParsing' methods, suggesting that the source code might have unmatched or missing delimiters (like '{' without a corresponding '}'.`)
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

  public expression (): AbstractExpression {
    return BinaryExpression.fromParser(this)
  }

  public primaryExpression (): PrimaryExpression {
    const token = this.getLookahead()
    if (this.lookaheadHasType(TokenType.BUILTIN_TYPE) && ['null', 'undefined'].includes(token.lexeme)) {
      return LiteralExpression.fromParser(this)
    }

    switch (token.type) {
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
        return ParenthesizedExpression.fromParser(this)
      }

      case TokenType.NEW: {
        return NewExpression.fromParser(this)
      }

      default:
        throw new SyntaxError(
            `Unexpected token '${this.getLookahead().lexeme}' at line ${this.getLookahead().startLine
            }.`
        )
    }
  }

  public leftHandSideExpression (): LeftHandSideExpression {
    const tokenAfterId = this.tokenAt(0)
    if (tokenAfterId == null) {
      return Identifier.fromParser(this)
    }

    if (tokenAfterId.type === TokenType.ASSIGN) {
      return AssignmentExpression.fromParser(this)
    }

    if (tokenAfterId.type === TokenType.LEFT_BRACKET) {
      return ArrayAccessExpression.fromParser(this)
    }

    // for CallExpression
    this.startParsing()

    // for MemberExpression
    this.startParsing()
    let id: Identifier | MemberExpression = Identifier.fromParser(this)
    if (this.lookaheadHasType(TokenType.DOT)) {
      id = MemberExpression.fromParser(this, id)
    } else {
      // Cancel if MemberExpression has not beed parsed
      this.endParsing()
    }

    if (this.lookaheadHasType(TokenType.LEFT_PAREN)) {
      return CallExpression.fromParser(this, id)
    }

    // Cancel if CallExpression has not beed parsed
    this.endParsing()

    return id
  }

  public parseArgs (): AbstractExpression[] {
    const args: AbstractExpression[] = []

    // argument list shouldn't start or end with a coma: ','
    while (!this.eof() && !this.lookaheadHasType(TokenType.COMA) && !this.lookaheadHasType(TokenType.RIGHT_PAREN)) {
      args.push(this.expression())

      if (!this.lookaheadHasType(TokenType.COMA)) {
        break
      }

      this.consume(TokenType.COMA)
    }

    return args
  }

  public parseType (typeSymbol: TokenType.COLON | TokenType.ARROW = TokenType.COLON): Type {
    this.consume(typeSymbol)

    let type: Type
    if (this.lookaheadHasType(TokenType.BUILTIN_TYPE)) {
      const lexeme = this.consume(TokenType.BUILTIN_TYPE).lexeme as BuiltinType
      type = new Type(lexeme)
    } else {
      type = new TypeRef(Identifier.fromParser(this))
    }

    if (this.lookaheadHasType(TokenType.LEFT_BRACKET)) {
      this.consume(TokenType.LEFT_BRACKET)

      type = new ArrayType(type)

      this.consume(TokenType.RIGHT_BRACKET)
    }

    return type
  }

  public startParsing (): void {
    this._parsingContext.push(this.lookahead)
  }

  public endParsing (): NodeSourceContext {
    const startToken = this._parsingContext.pop()
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

  public consume (expectedType: TokenType | null = null): Token {
    if (expectedType && !this.lookaheadHasType(expectedType)) {
      throw new SyntaxError(
          `Expected token '${expectedType}', but found '${this.getLookahead()?.lexeme
          }' at line ${this.getLookahead()?.startLine}.`
      )
    }

    this._prevLookahead = this.getLookahead()

    this.lookahead = this.getNextToken()

    return this._prevLookahead
  }

  public eof (): boolean {
    return this.lookaheadHasType(TokenType.EOF)
  }

  public tokenAt (index: number): Token | null {
    const token = this._tokens[index]
    if (typeof token === 'undefined') {
      return null
    }

    return token
  }

  public getNextToken (): Token {
    if (this._tokens.length > 0) {
      return this._tokens.shift() as Token
    }

    throw new SyntaxError('Unexpected end of line when accessing next token.')
  }

  public getLookahead (): Token {
    if (this.eof()) {
      throw new SyntaxError('Unexpected end of line.')
    }

    return this.lookahead
  }

  public lookaheadHasType (tokenType: TokenType): boolean {
    return this.lookahead.type === tokenType
  }
}
