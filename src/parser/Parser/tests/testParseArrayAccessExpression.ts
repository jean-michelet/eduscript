import ArrayAccessExpression from '../../Nodes/Expression/ArrayAccessExpression.js'
import Identifier from '../../Nodes/Expression/Identifier.js'
import { parseExpression, testThrowErrorIfNotFollowedBySemiColon } from './Parser.test.js'

export default function (): void {
  describe('Test parse ArrayAccessExpression', () => {
    test('should parse an ArrayAccessExpression', () => {
      const expr = parseExpression('x[1];') as ArrayAccessExpression

      expect(expr).toBeInstanceOf(ArrayAccessExpression)

      expect(expr.array).toBeInstanceOf(Identifier)
      expect((expr.array as Identifier).name).toBe('x')
      expect(expr.index).toBe(1)
    })

    test('should parse multi-dimensional ArrayAccessExpression', () => {
      const expr = parseExpression('x[1][2];') as ArrayAccessExpression

      expect(expr).toBeInstanceOf(ArrayAccessExpression)

      expect(expr.index).toBe(1)

      const innerArrayAccess = expr.array as ArrayAccessExpression
      expect(innerArrayAccess).toBeInstanceOf(ArrayAccessExpression)
      expect((innerArrayAccess.array as Identifier).name).toBe('x')
      expect(innerArrayAccess.index).toBe(2)
    })
  })

  testThrowErrorIfNotFollowedBySemiColon('x[1]')
}
