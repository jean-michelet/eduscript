import { check } from '../SemanticChecker.test.js'

export default function (): void {
  describe('Function declaration', () => {
    test('should allow valid function declarations', () => {
      const checkedAst = check('fn foo(a: number) -> void {};')

      expect(checkedAst.report.errors).toHaveLength(0)
    })

    test('should not allow invalid param assignment in function declarations', () => {
      const checkedAst = check('fn foo(a: number = "string") -> void {};')

      expect(checkedAst.report.errors).toHaveLength(1)
      expect(checkedAst.report.errors[0]).toBeInstanceOf(TypeError)
      expect(checkedAst.report.errors[0].message).toStartWith("Expected type 'number', given 'string' at line 1:7")
    })

    test('should throw errors for duplicate fn declarations', () => {
      const checkedAst = check('fn foo(a: number) -> void {}; fn foo(b: string) -> void {};')

      expect(checkedAst.report.errors).toHaveLength(1)
      expect(checkedAst.report.errors[0]).toBeInstanceOf(Error)
      expect(checkedAst.report.errors[0].message).toStartWith("Duplicate function 'foo'")
    })

    test('should enforce type consistency in fn parameters', () => {
      const checkedAst = check('fn foo(a: number) -> void { a = "not a number"; };')

      expect(checkedAst.report.errors).toHaveLength(1)
      expect(checkedAst.report.errors[0]).toBeInstanceOf(TypeError)
      expect(checkedAst.report.errors[0].message).toStartWith("Expected type 'number', given 'string'")
    })

    test('should check for return type consistency', () => {
      const checkedAst = check('fn foo(a: number) -> number { return "not a number"; }')

      expect(checkedAst.report.errors).toHaveLength(1)
      expect(checkedAst.report.errors[0]).toBeInstanceOf(TypeError)
      expect(checkedAst.report.errors[0].message).toStartWith("Expected return type 'number', given 'string'")
    })

    test('should allow nested fn declarations', () => {
      const checkedAst = check(`
        fn outer() -> void {
          fn inner() -> void {}
        }
      `)

      expect(checkedAst.report.errors).toHaveLength(0)
    })

    test.skip('should correctly handle function calls', () => {})
  })
}
