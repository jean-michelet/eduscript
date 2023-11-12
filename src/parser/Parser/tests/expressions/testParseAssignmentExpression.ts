import AssignmentExpression from '../../../Nodes/Expression/AssignmentExpression.js'
import Identifier from '../../../Nodes/Expression/Identifier.js'
import LiteralExpression from '../../../Nodes/Expression/LiteralExpression.js'
import { expectSourceContext, parseExpression, testThrowErrorIfNotFollowedBySemiColon } from '../Parser.test.js'

export default function (): void {
  describe('Test parse AssignmentExpression', () => {
    test('should parse an AssignmentExpression', () => {
      const expr = parseExpression('a = 2;') as AssignmentExpression

      expect(expr).toBeInstanceOf(AssignmentExpression)
      expectSourceContext(expr, {
        endTokenPos: 5
      })

      expect((expr.left as Identifier).name).toBe('a')
      expect((expr.right as LiteralExpression).literal).toBe(2)
    })

    testThrowErrorIfNotFollowedBySemiColon('a = 1')
  })
}
