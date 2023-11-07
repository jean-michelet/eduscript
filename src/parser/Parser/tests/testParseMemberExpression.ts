import Identifier from '../../Nodes/Expression/Identifier.js'
import MemberExpression from '../../Nodes/Expression/MemberExpression.js'
import { parseExpression, testThrowErrorIfNotFollowedBySemiColon } from './Parser.test.js'

export default function (): void {
  describe('Test parse MemberExpression', () => {
    test('should parse a MemberExpression', () => {
      const expr = parseExpression('x.y;') as MemberExpression

      expect(expr).toBeInstanceOf(MemberExpression)

      expect(((expr).property).name).toBe('x')
      expect(((expr).object as Identifier).name).toBe('y')
    })
  })

  testThrowErrorIfNotFollowedBySemiColon('x.y')
}
