import { check } from '../SemanticChecker.test.js'

export default function (): void {
  describe('Variable declaration', () => {
    test('should allow valid variable declarations', () => {
      const checkedAst = check('let a: number = 5; const b: string = "hello";')

      expect(checkedAst.report.errors).toHaveLength(0)
    })

    test('should throw errors for redeclarations in the same scope', () => {
      const checkedAst = check('let a: number = 5; let a: number = 10;')

      expect(checkedAst.report.errors).toHaveLength(1)
      expect(checkedAst.report.errors[0]).toBeInstanceOf(Error)
      expect(checkedAst.report.errors[0].message).toStartWith("Cannot redeclare block-scoped variable 'a'")
    })

    test('should ensure that const variables are initialized', () => {
      const checkedAst = check('const a: number;')

      expect(checkedAst.report.errors).toHaveLength(1)
      expect(checkedAst.report.errors[0]).toBeInstanceOf(Error)
      expect(checkedAst.report.errors[0].message).toStartWith(
      `'const' declarations must be initialized. at line 1:6
      > const a: number;
              ^`
      )
    })

    test('should enforce type consistency in variable initialization', () => {
      const checkedAst = check('let a: number = "not a number";')

      expect(checkedAst.report.errors).toHaveLength(1)
      expect(checkedAst.report.errors[0]).toBeInstanceOf(TypeError)
      expect(checkedAst.report.errors[0].message).toStartWith("Expected type 'number', given 'string'")
    })

    test('should allow variable redeclaration in a nested scope', () => {
      const checkedAst = check(`
              let a: number = 5;
              {
                  let a: string = "nested scope";
              }
          `)

      expect(checkedAst.report.errors).toHaveLength(0)
    })

    test('should not allow access to undeclared variable', () => {
      const checkedAst = check('b;')

      expect(checkedAst.report.errors).toHaveLength(1)
      expect(checkedAst.report.errors[0]).toBeInstanceOf(ReferenceError)
      expect(checkedAst.report.errors[0].message).toStartWith('b is not defined at line 1:0')
    })

    test('should allow access to declared variable', () => {
      const checkedAst = check(`
              let a: number = 5;
              a;
              {
                  a;
              }
          `)

      expect(checkedAst.report.errors).toHaveLength(0)
    })
  })
}
