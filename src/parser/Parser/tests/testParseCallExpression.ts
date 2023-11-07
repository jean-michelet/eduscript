import AssignmentExpression from '../../Nodes/Expression/AssignmentExpression.js'
import CallExpression from '../../Nodes/Expression/CallExpression.js'
import Identifier from '../../Nodes/Expression/Identifier.js'
import LiteralExpression from '../../Nodes/Expression/LiteralExpression.js'
import MemberExpression from '../../Nodes/Expression/MemberExpression.js'
import { parseExpression, testThrowErrorIfNotFollowedBySemiColon } from './Parser.test.js'

export default function (): void {
  describe('Test parse CallExpression', () => {
    test('should parse a CallExpression', () => {
      const expr = parseExpression('add();') as CallExpression

      expect(expr).toBeInstanceOf(CallExpression)

      expect((expr.callee as Identifier).name).toBe('add')
    })

    test('should parse a CallExpression with arguments', () => {
      const expr = parseExpression('add(1, a, a = 2, sub(1,2));') as CallExpression

      expect(expr).toBeInstanceOf(CallExpression)

      expect((expr.callee as Identifier).name).toBe('add')

      const args = expr.args
      expect(args[0]).toBeInstanceOf(LiteralExpression)
      expect(args[1]).toBeInstanceOf(Identifier)
      expect(args[2]).toBeInstanceOf(AssignmentExpression)
      expect(args[3]).toBeInstanceOf(CallExpression)
    })

    test('should parse a CallExpression with MemberExpression as callee', () => {
      const expr = parseExpression('math.add();') as CallExpression

      expect(expr).toBeInstanceOf(CallExpression)
      expect(expr.callee).toBeInstanceOf(MemberExpression)

      const member = expr.callee as MemberExpression

      expect((member.object as Identifier).name).toBe('add')
      expect((member.property).name).toBe('math')
    })
  })

  testThrowErrorIfNotFollowedBySemiColon('add()')
}
