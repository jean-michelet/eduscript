import Identifier from '../../../Nodes/Expression/Identifier.js'
import MemberExpression from '../../../Nodes/Expression/MemberExpression.js'
import { expectSourceContext, parseExpression, testThrowErrorIfNotFollowedBySemiColon } from '../Parser.test.js'

export default function (): void {
  describe('Test parse MemberExpression', () => {
    test('should parse a MemberExpression', () => {
      const expr = parseExpression('x.y;') as MemberExpression

      expect(expr).toBeInstanceOf(MemberExpression)
      expectSourceContext(expr, {
        endTokenPos: 3
      })

      expect(((expr).property).name).toBe('x')
      expect(((expr).object as Identifier).name).toBe('y')
    })

    test('should parse a nested MemberExpression', () => {
      const expr = parseExpression('x.y.z;') as MemberExpression

      expect(expr).toBeInstanceOf(MemberExpression)
      expectSourceContext(expr, {
        endTokenPos: 5
      })

      expect(((expr).property).name).toBe('x')
      expectSourceContext(expr.property, {
        endTokenPos: 1
      })

      expect(expr.object).toBeInstanceOf(MemberExpression)
      const member = expr.object as MemberExpression

      expect(((member).property).name).toBe('y')
      expectSourceContext(member.property, {
        startTokenPos: 2,
        endTokenPos: 3
      })

      expect((member.object as Identifier).name).toBe('z')
      expectSourceContext(member.object, {
        startTokenPos: 4,
        endTokenPos: 5
      })
    })
  })

  testThrowErrorIfNotFollowedBySemiColon('x.y')
}
