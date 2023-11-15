import LiteralExpression from '../../../Nodes/Expression/LiteralExpression.js'
import { expectSourceContext, parseExpression } from '../Parser.test.js'

export default function (): void {
  describe('Test parse LiteralExpression', () => {
    test('should parse a literal expression of type Number', () => {
      const expr = parseExpression('1;') as LiteralExpression

      expect(expr).toBeInstanceOf(LiteralExpression)
      expectSourceContext(expr, {
        endTokenPos: 1
      })

      expect(expr.kind).toBe('number')
      expect(expr.literal).toBe(1)
    })

    test('should parse a literal expression of type String', () => {
      const src = '"hi";'
      const expr = parseExpression(src) as LiteralExpression

      expect(expr).toBeInstanceOf(LiteralExpression)
      expectSourceContext(expr, {
        endTokenPos: 4
      })

      expect(expr.kind).toBe('string')
      expect(expr.literal).toBe('hi')
    })

    test('should parse a literal expression of type Boolean', () => {
      let expr = parseExpression('true;') as LiteralExpression
      expectSourceContext(expr, {
        endTokenPos: 4
      })

      expect(expr).toBeInstanceOf(LiteralExpression)

      expect(expr.kind).toBe('boolean')
      expect(expr.literal).toBe(true)

      expr = parseExpression('false;') as LiteralExpression
      expectSourceContext(expr, {
        endTokenPos: 5
      })

      expect(expr.kind).toBe('boolean')
      expect(expr.literal).toBe(false)
    })

    test('should parse a literal expression of type null', () => {
      const expr = parseExpression('null;') as LiteralExpression

      expect(expr).toBeInstanceOf(LiteralExpression)
      expectSourceContext(expr, {
        endTokenPos: 4
      })

      expect(expr.kind).toBe('null')
      expect(expr.literal).toBe(null)
    })

    test('should parse a literal expression of type undefined', () => {
      const expr = parseExpression('undefined;') as LiteralExpression

      expect(expr).toBeInstanceOf(LiteralExpression)
      expectSourceContext(expr, {
        endTokenPos: 'undefined'.length
      })

      expect(expr.kind).toBe('undefined')
      expect(expr.literal).toBe(undefined)
    })
  })
}
