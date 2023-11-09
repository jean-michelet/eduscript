import { checker, parser } from './SemanticChecker.test.js'

export default function (): void {
  test('should validate arithmetic operators with numbers', () => {
    const ast = parser.parse('1 + 2; 3 - 4; 5 * 6; 7 / 8;')
    const checkedAst = checker.check(ast)

    expect(checkedAst.attributes.errors).toHaveLength(0)
  })

  test('should throw type errors for arithmetic operators with non-numbers', () => {
    const ast = parser.parse('"a" + "b"; "a" - "b"; true * false; true / false;')
    const checkedAst = checker.check(ast)

    expect(checkedAst.attributes.errors).toHaveLength(4)
    expect(checkedAst.attributes.errors).toContain("Type error: Operator '+' can only be applied to 'number' types.")
    expect(checkedAst.attributes.errors).toContain("Type error: Operator '-' can only be applied to 'number' types.")
    expect(checkedAst.attributes.errors).toContain("Type error: Operator '*' can only be applied to 'number' types.")
    expect(checkedAst.attributes.errors).toContain("Type error: Operator '/' can only be applied to 'number' types.")
  })

  test('should not allow division by zero', () => {
    const ast = parser.parse('1 / 0;')
    const checkedAst = checker.check(ast)

    expect(checkedAst.attributes.errors).toHaveLength(1)
    expect(checkedAst.attributes.errors[0]).toBe('Semantic error: Division by zero is not allowed.')
  })

  test('should allow equality checks between same types', () => {
    const ast = parser.parse('42 == 42; "test" == "test"; true == false;')
    const checkedAst = checker.check(ast)

    expect(checkedAst.attributes.errors).toHaveLength(0)
  })

  test('should not allow equality checks between different types', () => {
    const ast = parser.parse('"42" == 42; true == "false";')
    const checkedAst = checker.check(ast)

    expect(checkedAst.attributes.errors).toHaveLength(2)
    expect(checkedAst.attributes.errors).toContain("Type error: Operator '==' requires operands of the same type, but got 'string' and 'number'.")
    expect(checkedAst.attributes.errors).toContain("Type error: Operator '==' requires operands of the same type, but got 'boolean' and 'string'.")
  })

  test('should validate relational operators with numbers', () => {
    const ast = parser.parse('1 > 2; 3 < 4; 5 >= 6; 7 <= 8;')
    const checkedAst = checker.check(ast)

    expect(checkedAst.attributes.errors).toHaveLength(0)
  })

  test('should throw type errors for relational operators with non-numbers', () => {
    const ast = parser.parse('"a" > "b"; true <= false;')
    const checkedAst = checker.check(ast)

    expect(checkedAst.attributes.errors).toHaveLength(2)
    expect(checkedAst.attributes.errors).toContain("Type error: Operator '>' can only be applied to 'number' types.")
    expect(checkedAst.attributes.errors).toContain("Type error: Operator '<=' can only be applied to 'number' types.")
  })

  test('should accept logical operations on booleans', () => {
    const ast = parser.parse('true && false; false || true;')
    const checkedAst = checker.check(ast)

    expect(checkedAst.attributes.errors).toHaveLength(0)
  })

  test('should not accept logical operations on non-booleans', () => {
    const ast = parser.parse('"true" && true; false || 1;')
    const checkedAst = checker.check(ast)

    expect(checkedAst.attributes.errors).toHaveLength(2)
    expect(checkedAst.attributes.errors).toContain("Type error: Operator '&&' can only be applied to 'boolean' types.")
    expect(checkedAst.attributes.errors).toContain("Type error: Operator '||' can only be applied to 'boolean' types.")
  })
}
