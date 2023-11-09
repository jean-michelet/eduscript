import LiteralExpression from '../../Nodes/Expression/LiteralExpression.js'
import { parseExpression } from './Parser.test.js'

export default function (): void {
  describe('Test parse LiteralExpression', () => {
    test('should parse a literal expression of type Number', () => {
      const expr = parseExpression('1;') as LiteralExpression

      expect(expr).toBeInstanceOf(LiteralExpression)

      expect(expr.kind).toBe('number')
      expect(expr.literal).toBe(1)
    })

    test('should parse a literal expression of type String', () => {
      const expr = parseExpression('"hello world";') as LiteralExpression

      expect(expr).toBeInstanceOf(LiteralExpression)

      expect(expr.kind).toBe('string')
      expect(expr.literal).toBe('hello world')
    })

    test('should parse a literal expression of type Boolean', () => {
      let expr = parseExpression('true;') as LiteralExpression

      expect(expr).toBeInstanceOf(LiteralExpression)

      expect(expr.kind).toBe('boolean')
      expect(expr.literal).toBe(true)

      expr = parseExpression('false;') as LiteralExpression

      expect(expr.kind).toBe('boolean')
      expect(expr.literal).toBe(false)
    })
  })
}
