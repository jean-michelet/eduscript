import NewExpression from '../../../Nodes/Expression/NewExpression.js'
import Identifier from '../../../Nodes/Expression/Identifier.js'
import { expectSourceContext, parseExpression, testThrowErrorIfNotFollowedBySemiColon } from '../Parser.test.js'
import LiteralExpression from '../../../Nodes/Expression/LiteralExpression.js'
import AssignmentExpression from '../../../Nodes/Expression/AssignmentExpression.js'
import CallExpression from '../../../Nodes/Expression/CallExpression.js'

export default function (): void {
  describe('Test parse NewExpression', () => {
    test('should parse a NewExpression', () => {
      const expr = parseExpression('new Foo();') as NewExpression

      expect(expr).toBeInstanceOf(NewExpression)
      expectSourceContext(expr, {
        endTokenPos: 9
      })

      expect((expr.identifier).name).toBe('Foo')
    })

    test('should parse a NewExpression with arguments', () => {
      const src = 'new Foo(1, a, a = 2, sub(1,2));'
      const expr = parseExpression(src) as NewExpression

      expect(expr).toBeInstanceOf(NewExpression)
      expectSourceContext(expr, {
        endTokenPos: src.length - 1
      })

      expect((expr.identifier).name).toBe('Foo')

      // look call expressions tests to check sourceContext parsing
      const args = expr.args
      expect(args[0]).toBeInstanceOf(LiteralExpression)
      expect(args[1]).toBeInstanceOf(Identifier)
      expect(args[2]).toBeInstanceOf(AssignmentExpression)
      expect(args[3]).toBeInstanceOf(CallExpression)
    })
  })

  testThrowErrorIfNotFollowedBySemiColon('new Foo()')
}
