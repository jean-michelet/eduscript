import BinaryExpression from '../../../Nodes/Expression/BinaryExpression.js'
import LiteralExpression from '../../../Nodes/Expression/LiteralExpression.js'
import { parseExpression, testThrowErrorIfNotFollowedBySemiColon } from '../Parser.test.js'

export default function (): void {
  describe('Test parser BinaryExpression', () => {
    const basicBinaryExpressions = [
      ['+', 1, 2],
      ['-', 1, 2],
      ['*', 1, 2],
      ['/', 1, 2],

      ['>', 1, 2],
      ['<', 1, 2],
      ['>=', 1, 2],
      ['<=', 1, 2],

      ['&&', true, true],
      ['||', true, false]
    ]

    basicBinaryExpressions.forEach(([op, left, right]) => {
      test(`should parse the binary expression "${left.toString()} ${op.toString()} ${right.toString()}"`, () => {
        const src = `${left.toString()} ${op.toString()} ${right.toString()};`
        const expr = parseExpression(src) as BinaryExpression

        expect(expr).toBeInstanceOf(BinaryExpression)
        expect(expr.operator).toBe(op)

        expect((expr.left as LiteralExpression).literal).toBe(left)
        expect((expr.right as LiteralExpression).literal).toBe(right)
      })
    })

    test('should parse binary expressions from left to right if no precedence', () => {
      const expr = parseExpression('1 * 2 * 3;') as BinaryExpression

      expect(expr.left).toBeInstanceOf(LiteralExpression)
      expect(expr.right).toBeInstanceOf(BinaryExpression)
    })

    test('should parse binary expressions with parenthesized expressions precedence over Multiplicative', () => {
      const expr = parseExpression('(1 + 2) * 3;') as BinaryExpression

      const left = expr.left as BinaryExpression
      expect((left.left as LiteralExpression).literal).toBe(1)
      expect((left.right as LiteralExpression).literal).toBe(2)

      expect((expr.right as LiteralExpression).literal).toBe(3)
    })

    const precedenceBinaryOperations = [
      // Multiplicative over Additive
      ['*', '+'],
      ['/', '+'],
      ['*', '-'],
      ['/', '-'],

      // Additive over Relationals
      ['+', '>'],
      ['-', '>'],
      ['+', '<'],
      ['-', '<'],
      ['+', '>='],
      ['-', '>='],
      ['+', '<='],
      ['-', '<='],

      // Relationals over Equalities
      ['>', '=='],
      ['>', '!='],
      ['<', '=='],
      ['<', '!='],
      ['>=', '=='],
      ['>=', '!='],
      ['<=', '=='],
      ['<=', '!='],

      // Equalities over LogicalAnd
      ['==', '&&'],
      ['!=', '&&'],

      // LogicalAnd over LogicalOr
      ['&&', '||']
    ]

    precedenceBinaryOperations.forEach(([preOp, op]) => {
      test(`should parse the binary expression with ${preOp} precedence over ${op}`, () => {
        const expr = parseExpression(`1 ${preOp} 2 ${op} 3;`) as BinaryExpression

        // because expression can be translated by (1 preOp 2) op 3
        const left = expr.left as BinaryExpression

        expect(left).toBeInstanceOf(BinaryExpression)

        expect((left.left as LiteralExpression).literal).toBe(1)
        expect((left.right as LiteralExpression).literal).toBe(2)

        expect((expr.right as LiteralExpression).literal).toBe(3)
      })
    })

    testThrowErrorIfNotFollowedBySemiColon('1 + 1')
  })
}
