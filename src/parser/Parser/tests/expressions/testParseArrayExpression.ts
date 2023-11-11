import ArrayExpression from '../../../Nodes/Expression/ArrayExpression.js'
import BinaryExpression from '../../../Nodes/Expression/BinaryExpression.js'
import Identifier from '../../../Nodes/Expression/Identifier.js'
import LiteralExpression from '../../../Nodes/Expression/LiteralExpression.js'
import { parseExpression, testThrowErrorIfNotFollowedBySemiColon } from '../Parser.test.js'

export default function (): void {
  describe('Test parse ArrayExpression', () => {
    test('should parse an ArrayExpression', () => {
      const expr = parseExpression('[1, y, 1 + 2];') as ArrayExpression

      expect(expr).toBeInstanceOf(ArrayExpression)

      const elements = (expr).elements

      expect(elements).toHaveLength(3)
      expect(elements[0]).toBeInstanceOf(LiteralExpression)
      expect(elements[1]).toBeInstanceOf(Identifier)
      expect(elements[2]).toBeInstanceOf(BinaryExpression)
    })
  })

  testThrowErrorIfNotFollowedBySemiColon('x.y')
}
