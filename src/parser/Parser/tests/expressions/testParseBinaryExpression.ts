import BinaryExpression from '../../../Nodes/Expression/BinaryExpression.js'
import LiteralExpression from '../../../Nodes/Expression/LiteralExpression.js'
import ParenthesizedExpression from '../../../Nodes/Expression/ParenthesizedExpression.js'
import { expectSourceContext, parseExpression, testThrowErrorIfNotFollowedBySemiColon } from '../Parser.test.js'

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
        expectSourceContext(expr, {
          endTokenPos: src.length - 1
        })

        expect((expr.left as LiteralExpression).literal).toBe(left)
        expect((expr.right as LiteralExpression).literal).toBe(right)
      })
    })

    test('should parse binary expressions to left if same precedence', () => {
      const src = '1 * 2 * 3;'
      const expr = parseExpression(src) as BinaryExpression
      expectSourceContext(expr, {
        endTokenPos: src.length - 1
      })

      expect(expr.left).toBeInstanceOf(BinaryExpression)

      expect(expr.right).toBeInstanceOf(LiteralExpression)
    })

    test('should parse binary expressions with parenthesized expressions precedence over Multiplicative', () => {
      const src = '(1 + 2) * 3;'
      const expr = parseExpression(src) as BinaryExpression
      expectSourceContext(expr, {
        endTokenPos: src.length - 1
      })

      const parenthesized = expr.left as ParenthesizedExpression
      expectSourceContext(parenthesized, {
        endTokenPos: 7
      })

      const left = parenthesized.expression as BinaryExpression
      expectSourceContext(left, {
        startTokenPos: 1,
        endTokenPos: 6
      })
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
