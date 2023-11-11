import SourceFileManager from './SourceFileManager.js'
import { Token, TokenType, TokenValue } from './Token.js'

export interface ScannerInterface {
  init: (src: string) => void
  scan: () => Token[]
  scanToken: () => Token
}

export default class Scanner implements ScannerInterface {
  private _src = ''
  private _startTokenPos = 0
  private _endTokenPos = 0
  private _startLine = 1
  private _endLine = 0
  private readonly _whitespaceChars = [' ', '\r', '\t', '\n']
  private _sourceFile: SourceFileManager = new SourceFileManager('')

  init (src: string = ''): void {
    this._src = src
    this._startTokenPos = 0
    this._endTokenPos = 0
    this._startLine = 1
    this._endLine = 1
    this._sourceFile = new SourceFileManager(src)
  }

  scan (): Token[] {
    const tokens: Token[] = []
    let currentToken: Token = this.scanToken()
    while (currentToken != null) {
      tokens.push(currentToken)
      currentToken = this.scanToken()
    }

    return tokens
  }

  scanToken (): Token {
    if (this._atEnd()) {
      return this._createToken(TokenType.EOF)
    }

    this._startLine = this._endLine
    this._startTokenPos = this._endTokenPos

    const char: string = this._advance()
    if (this._isWhitespaceChar(char)) {
      if (char === '\n') this._endLine++

      return this.scanToken()
    }

    if (char === '/' && (this._peek() === '/' || this._peek() === '*')) {
      return this._skipComments()
    }

    if (this._isDigit(char)) {
      return this._number()
    }

    const symbol = this._tryScanningSymbol(char)
    if (symbol !== null) {
      return symbol
    }

    const keywordToken = this._tryScanningKeyword(char)
    if (keywordToken !== null) {
      return keywordToken
    }

    if (this._isIdentifier(char)) {
      return this._identifier()
    }

    const invalidToken = this._createToken(TokenType.INVALID)
    const lineInfo = this._sourceFile.getHighlightedLineInfo(this._endLine, invalidToken)

    throw new SyntaxError(`Unexpected char '${char}' at line ${this._endLine}:${lineInfo.startPos}.${lineInfo.line}`)
  }

  private _tryScanningSymbol (char: string): Token | null {
    switch (char) {
      case '"':
        return this._string()

      // Symbols
      case '.':
        return this._createToken(TokenType.DOT)
      case ':':
        return this._createToken(TokenType.COLON)
      case ';':
        return this._createToken(TokenType.SEMI_COLON)
      case ',':
        return this._createToken(TokenType.COMA)
      case '(':
        return this._createToken(TokenType.LEFT_PAREN)
      case ')':
        return this._createToken(TokenType.RIGHT_PAREN)
      case '{':
        return this._createToken(TokenType.LEFT_CBRACE)
      case '}':
        return this._createToken(TokenType.RIGHT_CBRACE)
      case '[':
        return this._createToken(TokenType.LEFT_BRACKET)
      case ']':
        return this._createToken(TokenType.RIGHT_BRACKET)

      // arithmetic operators
      case '+':
      case '-':
        return this._createToken(TokenType.ADDITIVE)
      case '*':
      case '/':
        return this._createToken(TokenType.MULTIPLICATIVE)

      // relational operators
      case '>':
        if (this._peek() === '=') {
          this._advance()
          return this._createToken(TokenType.GREATER_EQUAL)
        }
        return this._createToken(TokenType.GREATER_THAN)
      case '<':
        if (this._peek() === '=') {
          this._advance()
          return this._createToken(TokenType.LESS_EQUAL)
        }
        return this._createToken(TokenType.LESS_THAN)
      // logical operators
      case '&':
        if (this._peek() === '&') {
          this._advance()
          return this._createToken(TokenType.LOGICAL_AND)
        }
        break
      case '|':
        if (this._peek() === '|') {
          this._advance()
          return this._createToken(TokenType.LOGICAL_OR)
        }
        break
      // assignment operators
      case '=':
        if (this._peek() === '=') {
          this._advance()
          return this._createToken(TokenType.EQUAL)
        }

        return this._createToken(TokenType.ASSIGN)
      case '!':
        if (this._peek() === '=') {
          this._advance()
          return this._createToken(TokenType.NOT_EQUAL)
        }

        return this._createToken(TokenType.NOT)
    }

    return null
  }

  private _tryScanningKeyword (char: string): Token | null {
    if (char === 'b') {
      if (this._followedBy('reak')) {
        return this._createToken(TokenType.BREAK)
      }

      if (this._followedBy('oolean')) {
        return this._createToken(TokenType.BUILTIN_TYPE)
      }
    }

    if (char === 'c') {
      if (this._followedBy('onst')) {
        return this._createToken(TokenType.CONST)
      }

      if (this._followedBy('ontinue')) {
        return this._createToken(TokenType.CONTINUE)
      }

      if (this._followedBy('lass')) {
        return this._createToken(TokenType.CLASS)
      }
    }

    if (char === 'e') {
      if (this._followedBy('lse if')) {
        return this._createToken(TokenType.ELSE_IF)
      }

      if (this._followedBy('lse')) {
        return this._createToken(TokenType.ELSE)
      }

      if (this._followedBy('xport')) {
        return this._createToken(TokenType.EXPORT)
      }

      if (this._followedBy('xtends')) {
        return this._createToken(TokenType.EXTENDS)
      }
    }

    if (char === 'f') {
      if (this._followedBy('n')) {
        return this._createToken(TokenType.FN)
      }

      if (this._followedBy('or')) {
        return this._createToken(TokenType.FOR)
      }

      if (this._followedBy('alse')) {
        return this._boolean()
      }
    }

    if (char === 'i') {
      if (this._followedBy('f')) {
        return this._createToken(TokenType.IF)
      }

      if (this._followedBy('mport')) {
        return this._createToken(TokenType.IMPORT)
      }
    }

    if (char === 'l' && this._followedBy('et')) {
      return this._createToken(TokenType.LET)
    }

    if (char === 'n') {
      if (this._followedBy('umber')) {
        return this._createToken(TokenType.BUILTIN_TYPE)
      }
      if (this._followedBy('ull')) {
        return this._createToken(TokenType.BUILTIN_TYPE)
      }
    }

    if (char === 'p') {
      if (this._followedBy('ublic')) {
        return this._createToken(TokenType.PUBLIC)
      }

      if (this._followedBy('rotected')) {
        return this._createToken(TokenType.PROTECTED)
      }

      if (this._followedBy('rivate')) {
        return this._createToken(TokenType.PRIVATE)
      }
    }

    if (char === 'r' && this._followedBy('eturn')) {
      return this._createToken(TokenType.RETURN)
    }

    if (char === 's') {
      if (this._followedBy('tatic')) {
        return this._createToken(TokenType.STATIC)
      }

      if (this._followedBy('tring')) {
        return this._createToken(TokenType.BUILTIN_TYPE)
      }
    }

    if (char === 't' && this._followedBy('rue')) {
      return this._boolean()
    }

    if (char === 'v' && this._followedBy('oid')) {
      return this._createToken(TokenType.BUILTIN_TYPE)
    }

    if (char === 'w' && this._followedBy('hile')) {
      return this._createToken(TokenType.WHILE)
    }

    return null
  }

  private _skipComments (): Token {
    // Single line comment
    if (this._peek() === '/') {
      while (this._peek() !== '\n' && !this._atEnd()) {
        this._advance()
      }

      return this.scanToken()
    }

    // Multi-line comment
    while (!this._atEnd()) {
      if (this._peek() === '*' && this._peekAt(1) === '/') {
        this._advance()
        this._advance()
        break
      }

      if (this._advance() === '\n') {
        this._endLine++
      }
    }

    return this.scanToken()
  }

  private _identifier (): Token {
    while (this._isAlpha(this._peek())) {
      this._advance()
    }

    const token = this._createToken(TokenType.IDENTIFIER)

    return token
  }

  private _string (): Token {
    this._advance()
    while (this._peek() !== '"') {
      this._advance()
    }

    const string = this._src.substring(this._startTokenPos + 1, this._endTokenPos)

    this._advance()

    return this._createToken(TokenType.STRING, string)
  }

  private _number (): Token {
    while (this._isDigit(this._peek())) {
      this._advance()
    }

    const value = Number(
      this._src.substring(this._startTokenPos, this._endTokenPos)
    )

    return this._createToken(TokenType.NUMBER, value)
  }

  private _boolean (): Token {
    const value = this._src.substring(this._startTokenPos, this._endTokenPos) === 'true'

    return this._createToken(TokenType.BOOLEAN, value)
  }

  private _followedBy (chars: string): boolean {
    let i = 1
    for (; i < chars.length; i++) {
      if (chars[i] !== this._peekAt(i)) {
        return false
      }
    }

    // keywords must not be followed by an alpha char because it might be an identifier or another keyword
    // 'let' keyword vs 'letter' identifier
    if (this._isAlpha(this._peekAt(i))) {
      return false
    }

    // Advance only when sure it's a match
    this._endTokenPos += chars.length

    return true
  }

  private _peek (): string {
    if (this._atEnd()) {
      return ''
    }

    return this._src.charAt(this._endTokenPos)
  }

  private _peekAt (pos = 1): string {
    if (this._endTokenPos + pos >= this._src.length) {
      return ''
    }

    return this._src.charAt(this._endTokenPos + pos)
  }

  private _advance (): string {
    return this._src.charAt(this._endTokenPos++)
  }

  // identifier can only start by a letter or `_`
  private _isIdentifier (char: string): boolean {
    return this._isLetter(char) || char === '_'
  }

  private _isDigit (char: string): boolean {
    return char >= '0' && char <= '9'
  }

  private _isLetter (char: string): boolean {
    return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')
  }

  private _isAlpha (char: string): boolean {
    return char === '_' || this._isDigit(char) || this._isLetter(char)
  }

  private _isWhitespaceChar (char: string): boolean {
    return this._whitespaceChars.includes(char)
  }

  private _atEnd (): boolean {
    return this._endTokenPos >= this._src.length
  }

  private _createToken (type: TokenType, value: TokenValue = null): Token {
    const lexeme = this._src.substring(
      this._startTokenPos,
      this._endTokenPos
    )

    return {
      type,
      lexeme: lexeme.trim(),
      value,
      startLine: this._startLine,
      endLine: this._endLine,
      startPos: this._startTokenPos,
      endPos: this._endTokenPos
    }
  }
}
