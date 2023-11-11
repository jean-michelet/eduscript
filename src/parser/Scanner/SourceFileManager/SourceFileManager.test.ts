import { Token, TokenType } from '../Token.js'
import SourceFileManager from './SourceFileManager.js'

describe('SourceFileManager', () => {
  const firstLine = '// First line'
  const secondLine = '// Second line'
  const lastLine = 'a = 13;'

  // + 1 because of \n
  const secondLinePos = firstLine.length + 1
  const lastLinePos = secondLinePos + secondLine.length + 1

  const src = firstLine + '\n' + secondLine + '\n' + lastLine
  let manager: SourceFileManager

  beforeEach(() => {
    manager = new SourceFileManager(src)
  })

  describe('getLineInfo', () => {
    it('should return correct line info for a valid line number', () => {
      const lineInfo = manager.getLineInfo(2)
      expect(lineInfo).toEqual({
        line: secondLine,
        lineNumber: 2,
        startPos: secondLinePos,
        endPos: secondLinePos + secondLine.length
      })
    })

    it('should throw an error for an invalid line number', () => {
      expect(() => {
        manager.getLineInfo(10)
      }).toThrow('Invalid line number: 10')
    })
  })

  describe('getLineWithHighlightedToken', () => {
    it('should correctly highlight a token at the start of a line', () => {
      const token: Token = {
        type: TokenType.IDENTIFIER,
        lexeme: 'a',
        value: null,
        startLine: 3,
        endLine: 3,
        startPos: lastLinePos,
        endPos: lastLinePos + 1
      }

      const highlightedLine = manager.getLineWithHighlightedToken(3, token)

      expect(highlightedLine.line).toContain(`
      > a = 13;
        ^`)
    })

    it('should correctly highlight a token in the middle of a line', () => {
      const token = {
        type: TokenType.NUMBER,
        lexeme: '13',
        value: 13,
        startLine: 3,
        endLine: 3,
        startPos: lastLinePos + 4,
        endPos: lastLinePos + lastLine.length
      } satisfies Token

      const highlightedLine = manager.getLineWithHighlightedToken(3, token)

      expect(highlightedLine.line).toContain(`
      > a = 13;
            ^`)
    })

    it('should correctly highlight a token  at the end of a line', () => {
      const startPos = lastLinePos + lastLine.length - 1
      const token = {
        type: TokenType.SEMI_COLON,
        lexeme: ';',
        value: null,
        startLine: 3,
        endLine: 3,
        startPos,
        endPos: startPos + 1
      } satisfies Token

      const highlightedLine = manager.getLineWithHighlightedToken(3, token)

      expect(highlightedLine.line).toContain(`
      > a = 13;
              ^`)
    })
  })
})
