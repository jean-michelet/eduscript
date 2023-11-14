import Scanner from './Scanner.js'
import { Token, TokenType } from './Token.js'

describe('Scanner Tests', () => {
  const scanner = new Scanner()

  function testScanToken (lexeme: string, tokenType: TokenType): void {
    test(`should scan a token of type ${tokenType}`, () => {
      scanner.init(lexeme)
      const token = scanner.scanToken()
      expect(token.type).toBe(tokenType)
      expect(token.lexeme).toBe(lexeme)
      expect(token.startPos).toBe(0)
      expect(token.endPos).toBe(token.lexeme.length)
    })
  }

  test('should scan a list of tokens', () => {
    scanner.init('let x = 1 ;')
    const tokens = scanner.scan()
    expect((tokens.shift() as Token).type).toBe(TokenType.LET)
    expect((tokens.shift() as Token).type).toBe(TokenType.IDENTIFIER)
    expect((tokens.shift() as Token).type).toBe(TokenType.ASSIGN)
    expect((tokens.shift() as Token).type).toBe(TokenType.NUMBER)
    expect((tokens.shift() as Token).type).toBe(TokenType.SEMI_COLON)
    expect((tokens.shift() as Token).type).toBe(TokenType.EOF)
  })

  const testFixtures = [
    ['.', TokenType.DOT],
    [':', TokenType.COLON],
    [';', TokenType.SEMI_COLON],
    [',', TokenType.COMA],
    ['(', TokenType.LEFT_PAREN],
    [')', TokenType.RIGHT_PAREN],
    ['{', TokenType.LEFT_CBRACE],
    ['}', TokenType.RIGHT_CBRACE],
    ['[', TokenType.LEFT_BRACKET],
    [']', TokenType.RIGHT_BRACKET],
    ['+', TokenType.ADDITIVE],
    ['*', TokenType.MULTIPLICATIVE],
    ['!', TokenType.NOT],
    ['==', TokenType.EQUAL],
    ['!=', TokenType.NOT_EQUAL],
    ['>', TokenType.GREATER_THAN],
    ['<', TokenType.LESS_THAN],
    ['>=', TokenType.GREATER_EQUAL],
    ['<=', TokenType.LESS_EQUAL],
    ['&&', TokenType.LOGICAL_AND],
    ['||', TokenType.LOGICAL_OR],
    ['=', TokenType.ASSIGN],
    ['let', TokenType.LET],
    ['class', TokenType.CLASS],
    ['extends', TokenType.EXTENDS],
    ['static', TokenType.STATIC],
    ['this', TokenType.THIS],
    ['parent', TokenType.PARENT],
    ['new', TokenType.NEW],
    ['public', TokenType.PUBLIC],
    ['protected', TokenType.PROTECTED],
    ['private', TokenType.PRIVATE],
    ['const', TokenType.CONST],
    ['fn', TokenType.FN],
    ['if', TokenType.IF],
    ['else', TokenType.ELSE],
    ['else if', TokenType.ELSE_IF],
    ['for', TokenType.FOR],
    ['while', TokenType.WHILE],
    ['return', TokenType.RETURN],
    ['import', TokenType.IMPORT],
    ['export', TokenType.EXPORT],
    ['break', TokenType.BREAK],
    ['continue', TokenType.CONTINUE],
    ['identifier', TokenType.IDENTIFIER],

    // built-in types,
    ['number', TokenType.BUILTIN_TYPE],
    ['string', TokenType.BUILTIN_TYPE],
    ['boolean', TokenType.BUILTIN_TYPE],
    ['null', TokenType.BUILTIN_TYPE],
    ['void', TokenType.BUILTIN_TYPE]
  ] satisfies Array<[string, TokenType]>

  for (const [lexeme, tokenType] of testFixtures) {
    testScanToken(lexeme, tokenType)
  }

  test('should accept identifiers starting with keyword substring, e.i. letter (starts with let)', () => {
    scanner.init('letVar whileVar')
    let token = scanner.scanToken()
    expect(token.type).toBe(TokenType.IDENTIFIER)
    expect(token.lexeme).toBe('letVar')

    token = scanner.scanToken()
    expect(token.type).toBe(TokenType.IDENTIFIER)
    expect(token.lexeme).toBe('whileVar')
  })

  test('should skip comments', () => {
    scanner.init(`
      // this is a single-line comment
      /**
       * This is a multi-line comment
       */
      14
    `)
    const token = scanner.scanToken()
    expect(token.type).toBe(TokenType.NUMBER)
    expect(token.lexeme).toBe('14')
    expect(token.value).toBe(14)
    expect(token.startLine).toBe(6)
    expect(token.endLine).toBe(6)
  })

  test(`should scan a token of type ${TokenType.STRING}`, () => {
    scanner.init('"Hello world"')
    const token = scanner.scanToken()
    expect(token.type).toBe(TokenType.STRING)
    expect(token.lexeme).toBe('"Hello world"')
    expect(token.value).toBe('Hello world')
  })

  test(`should scan a token of type ${TokenType.NUMBER}`, () => {
    scanner.init('123')
    const token = scanner.scanToken()
    expect(token.type).toBe(TokenType.NUMBER)
    expect(token.lexeme).toBe('123')
    expect(token.value).toBe(123)
  })

  test(`should scan a token of type ${TokenType.BOOLEAN}`, () => {
    scanner.init('true false')
    let token = scanner.scanToken()
    expect(token.type).toBe(TokenType.BOOLEAN)
    expect(token.lexeme).toBe('true')
    expect(token.value).toBe(true)

    token = scanner.scanToken()
    expect(token.type).toBe(TokenType.BOOLEAN)
    expect(token.lexeme).toBe('false')
    expect(token.value).toBe(false)
  })

  test('should skip white spaces', () => {
    scanner.init('   12')
    const token = scanner.scanToken()
    expect(token.type).toBe(TokenType.NUMBER)
    expect(token.lexeme).toBe('12')
    expect(token.value).toBe(12)
  })

  test('should keep track of the current line', () => {
    scanner.init(`

    12`)
    let token = scanner.scanToken()
    expect(token.lexeme).toBe('12')
    expect(token.startLine).toBe(3)
    expect(token.endLine).toBe(3)

    scanner.init('\n\n 12')
    token = scanner.scanToken()
    expect(token.lexeme).toBe('12')
    expect(token.startLine).toBe(3)
  })

  test('should throw an error on invalid token', () => {
    scanner.init('let x = @;')
    expect(() => scanner.scan()).toThrow(`Unexpected char '@' at line 1:8.
      > let x = @;
                ^`)
  })
})
