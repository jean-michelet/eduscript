import { checker, parser } from '../SemanticChecker.test.js'

export default function (): void {
  test('should allow valid variable declarations', () => {
    const ast = parser.parse('let a: number = 5; const b: string = "hello";')
    const checkedAst = checker.check(ast)

    expect(checkedAst.report.errors).toHaveLength(0)
  })

  test('should throw errors for redeclarations in the same scope', () => {
    const ast = parser.parse('let a: number = 5; let a: number = 10;')
    const checkedAst = checker.check(ast)

    expect(checkedAst.report.errors).toHaveLength(1)
    expect(checkedAst.report.errors[0]).toBeInstanceOf(Error)
    expect(checkedAst.report.errors[0].message).toStartWith("Cannot redeclare block-scoped variable 'a'")
  })

  test('should ensure that const variables are initialized', () => {
    const ast = parser.parse('const a: number;')
    const checkedAst = checker.check(ast)

    expect(checkedAst.report.errors).toHaveLength(1)
    expect(checkedAst.report.errors[0]).toBeInstanceOf(Error)
    expect(checkedAst.report.errors[0].message).toStartWith(
    `'const' declarations must be initialized. at line 1:6
      > const a: number;
              ^`
    )
  })

  test('should enforce type consistency in variable initialization', () => {
    const ast = parser.parse('let a: number = "not a number";')
    const checkedAst = checker.check(ast)

    expect(checkedAst.report.errors).toHaveLength(1)
    expect(checkedAst.report.errors[0]).toBeInstanceOf(TypeError)
    expect(checkedAst.report.errors[0].message).toStartWith("Type 'string' is not assignable to type 'number'")
  })

  test('should allow variable redeclaration in a nested scope', () => {
    const ast = parser.parse(`
            let a: number = 5;
            {
                let a: string = "nested scope";
            }
        `)
    const checkedAst = checker.check(ast)

    expect(checkedAst.report.errors).toHaveLength(0)
  })

  test('should not allow access to undeclared variable', () => {
    const ast = parser.parse('b;')
    const checkedAst = checker.check(ast)

    expect(checkedAst.report.errors).toHaveLength(1)
    expect(checkedAst.report.errors[0]).toBeInstanceOf(ReferenceError)
    expect(checkedAst.report.errors[0].message).toStartWith('b is not defined at line 1:0')
  })

  test('should allow access to declared variable', () => {
    const ast = parser.parse(`
            let a: number = 5;
            a;
            {
                a;
            }
        `)
    const checkedAst = checker.check(ast)

    expect(checkedAst.report.errors).toHaveLength(0)
  })
}
