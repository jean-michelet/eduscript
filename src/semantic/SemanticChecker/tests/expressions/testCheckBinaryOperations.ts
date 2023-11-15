import { check } from '../SemanticChecker.test.js'

export default function (): void {
  describe('Binary operations', () => {
    test('should validate arithmetic operators with numbers', () => {
      const checkedAst = check('1 + 2; 3 - 4; 5 * 6; 7 / 8;')

      expect(checkedAst.report.errors).toHaveLength(0)
    })

    test('should throw type errors for arithmetic operators with non-numbers', () => {
      const checkedAst = check('"a" + "b"; "a" - "b"; true * false; true / false;')

      expect(checkedAst.report.errors).toHaveLength(4)
      const operators = ['+', '-', '*', '/']
      operators.forEach((op, i) => {
        expect(checkedAst.report.errors[i]).toBeInstanceOf(TypeError)
        expect(checkedAst.report.errors[i].message).toStartWith(`Operator '${op}' can only be applied to 'number'`)
      })

      expect(checkedAst.report.errors[0].message).toStartWith(
      `Operator '+' can only be applied to 'number' types at line 1:0
      > "a" + "b"; "a" - "b"; true * false; true / false;
        ^`
      )
    })

    test('should not allow division by zero', () => {
      const checkedAst = check('1 / 0;')

      expect(checkedAst.report.errors).toHaveLength(1)
      expect(checkedAst.report.errors[0]).toBeInstanceOf(Error)
      expect(checkedAst.report.errors[0].message).toStartWith('Division by zero is not allowed.')
    })

    test('should allow equality checks between same types', () => {
      const checkedAst = check('42 == 42; "test" == "test"; true == false;')

      expect(checkedAst.report.errors).toHaveLength(0)
    })

    test('should not allow equality checks between different types', () => {
      const checkedAst = check('"42" == 42; true == "false";')

      expect(checkedAst.report.errors).toHaveLength(2)
      expect(checkedAst.report.errors[0].message).toStartWith("Operator '==' requires operands of the same type, but got 'string' and 'number'")
      expect(checkedAst.report.errors[0]).toBeInstanceOf(TypeError)
      expect(checkedAst.report.errors[1].message).toStartWith("Operator '==' requires operands of the same type, but got 'boolean' and 'string'")
      expect(checkedAst.report.errors[1]).toBeInstanceOf(TypeError)
    })

    test('should validate relational operators with numbers', () => {
      const checkedAst = check('1 > 2; 3 < 4; 5 >= 6; 7 <= 8;')

      expect(checkedAst.report.errors).toHaveLength(0)
    })

    test('should throw type errors for relational operators with non-numbers', () => {
      const checkedAst = check('"a" > "b"; true <= false;')

      expect(checkedAst.report.errors).toHaveLength(2)
      expect(checkedAst.report.errors[0].message).toStartWith("Operator '>' can only be applied to 'number' types")
      expect(checkedAst.report.errors[0]).toBeInstanceOf(TypeError)
      expect(checkedAst.report.errors[1].message).toStartWith("Operator '<=' can only be applied to 'number' types")
      expect(checkedAst.report.errors[1]).toBeInstanceOf(TypeError)
    })

    test('should accept logical operations on booleans', () => {
      const checkedAst = check('true && false; false || true;')

      expect(checkedAst.report.errors).toHaveLength(0)
    })

    test('should accept parenthesized operations on booleans', () => {
      const checkedAst = check('(true && false); (false) || true;')

      expect(checkedAst.report.errors).toHaveLength(0)
    })

    test('should not accept logical operations on non-booleans', () => {
      const checkedAst = check('"true" && true; false || 1;')

      expect(checkedAst.report.errors).toHaveLength(2)
      expect(checkedAst.report.errors[0].message).toStartWith("Operator '&&' can only be applied to 'boolean' types")
      expect(checkedAst.report.errors[0]).toBeInstanceOf(TypeError)

      expect(checkedAst.report.errors[1].message).toStartWith("Operator '||' can only be applied to 'boolean' types")
      expect(checkedAst.report.errors[1]).toBeInstanceOf(TypeError)
    })
  })
}
