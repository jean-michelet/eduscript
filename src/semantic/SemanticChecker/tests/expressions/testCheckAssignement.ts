import { check } from '../SemanticChecker.test.js'

export default function (): void {
  describe('Assignement', () => {
    test('should allow valid type assignments', () => {
      const checkedAst = check('let a: number; a = 5;')

      expect(checkedAst.report.errors).toHaveLength(0)
    })

    test('should not allow invalid type assignments', () => {
      const checkedAst = check('let a: number; a = "hello";')

      expect(checkedAst.report.errors).toHaveLength(1)
      expect(checkedAst.report.errors[0]).toBeInstanceOf(TypeError)
      expect(checkedAst.report.errors[0].message).toStartWith("Expected type 'number', given 'string'")
    })

    test('should not allow assignement to an undeclared variable', () => {
      const checkedAst = check('b = 1;')

      expect(checkedAst.report.errors).toHaveLength(2)
      expect(checkedAst.report.errors[0]).toBeInstanceOf(ReferenceError)
      expect(checkedAst.report.errors[0].message).toStartWith('b is not defined at line 1:0')
    })
  })
}
