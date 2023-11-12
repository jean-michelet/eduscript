import ArrayExpression from '../../../Nodes/Expression/ArrayExpression.js'
import BinaryExpression from '../../../Nodes/Expression/BinaryExpression.js'
import Identifier from '../../../Nodes/Expression/Identifier.js'
import LiteralExpression from '../../../Nodes/Expression/LiteralExpression.js'
import { expectSourceContext, parseExpression, testThrowErrorIfNotFollowedBySemiColon } from '../Parser.test.js'

export default function (): void {
  describe('Test parse ArrayExpression', () => {
    test('should parse an ArrayExpression', () => {
      const src = '[1, y, 1 + 2];'
      const expr = parseExpression(src) as ArrayExpression

      expect(expr).toBeInstanceOf(ArrayExpression)
      expectSourceContext(expr, {
        endTokenPos: src.length - 1
      })

      const elements = (expr).elements

      expect(elements).toHaveLength(3)
      expect(elements[0]).toBeInstanceOf(LiteralExpression)
      expect(elements[1]).toBeInstanceOf(Identifier)
      expect(elements[2]).toBeInstanceOf(BinaryExpression)
    })
  })

  testThrowErrorIfNotFollowedBySemiColon('x.y')
}
