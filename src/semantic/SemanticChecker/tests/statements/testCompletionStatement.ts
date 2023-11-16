import { check } from '../SemanticChecker.test.js'

export default function (): void {
  describe('Return statement', () => {
    test('should throw error when a ReturnStatement is outside a function', () => {
      const checkedAst = check('return 1;')

      expect(checkedAst.report.errors).toHaveLength(1)
      expect(checkedAst.report.errors[0]).toBeInstanceOf(Error)
      expect(checkedAst.report.errors[0].message).toStartWith("A 'return' statement can only be used within a function body")
    })
  })
}
