import AssignmentExpression from '../../../Nodes/Expression/AssignmentExpression.js'
import CallExpression from '../../../Nodes/Expression/CallExpression.js'
import Identifier from '../../../Nodes/Expression/Identifier.js'
import LiteralExpression from '../../../Nodes/Expression/LiteralExpression.js'
import MemberExpression from '../../../Nodes/Expression/MemberExpression.js'
import { expectSourceContext, parseExpression, testThrowErrorIfNotFollowedBySemiColon } from '../Parser.test.js'

export default function (): void {
  describe('Test parse CallExpression', () => {
    test('should parse a CallExpression', () => {
      const expr = parseExpression('add();') as CallExpression

      expect(expr).toBeInstanceOf(CallExpression)
      expectSourceContext(expr, {
        endTokenPos: 5
      })

      expect((expr.callee as Identifier).name).toBe('add')
    })

    test('should parse a CallExpression with arguments', () => {
      const src = 'add(1, a, a = 2, sub(1,2));'
      const expr = parseExpression(src) as CallExpression

      expect(expr).toBeInstanceOf(CallExpression)
      expectSourceContext(expr, {
        endTokenPos: src.length - 1
      })

      expect((expr.callee as Identifier).name).toBe('add')

      const args = expr.args
      expect(args[0]).toBeInstanceOf(LiteralExpression)
      expectSourceContext(args[0] as LiteralExpression, {
        startTokenPos: 4,
        endTokenPos: 5
      })

      expect(args[1]).toBeInstanceOf(Identifier)
      expectSourceContext(args[1] as Identifier, {
        startTokenPos: 7,
        endTokenPos: 8
      })

      expect(args[2]).toBeInstanceOf(AssignmentExpression)
      expectSourceContext(args[2] as AssignmentExpression, {
        startTokenPos: 10,
        endTokenPos: 15
      })

      expect(args[3]).toBeInstanceOf(CallExpression)
      expectSourceContext(args[3] as CallExpression, {
        startTokenPos: 17,
        endTokenPos: src.length - 2
      })
    })

    test('should parse a CallExpression with MemberExpression as callee', () => {
      const src = 'math.add();'
      const expr = parseExpression(src) as CallExpression

      expect(expr).toBeInstanceOf(CallExpression)
      expectSourceContext(expr, {
        endTokenPos: src.length - 1
      })

      expect(expr.callee).toBeInstanceOf(MemberExpression)
      const member = expr.callee as MemberExpression

      expect((member.object as Identifier).name).toBe('add')
      expect((member.property).name).toBe('math')
    })
  })

  testThrowErrorIfNotFollowedBySemiColon('add()')
}
