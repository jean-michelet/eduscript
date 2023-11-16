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
      const checkedAst = check(`
        fn foo(a: number) -> void { a = "not a number"; };
        fn add(a: number, b: string) -> number { return a + b; }
      `)

      expect(checkedAst.report.errors).toHaveLength(2)
      expect(checkedAst.report.errors[0]).toBeInstanceOf(TypeError)
      expect(checkedAst.report.errors[0].message).toStartWith("Expected type 'number', given 'string' at line 2")

      expect(checkedAst.report.errors[1]).toBeInstanceOf(TypeError);
      expect(checkedAst.report.errors[1].message).toStartWith("Operator '+' can only be applied to 'number' types at line 3");
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

  describe('Function call handling', () => {
    test('should allow valid function calls', () => {
      const checkedAst = check(`
        fn add(a: number, b: number) -> number { return a + b; }
        let result: number = add(5, 10);
      `);

      expect(checkedAst.report.errors).toHaveLength(0);
    });

    test('should throw error for calling an undefined function', () => {
      const checkedAst = check('unknownFunction(5, 10);');

      expect(checkedAst.report.errors).toHaveLength(1);
      expect(checkedAst.report.errors[0]).toBeInstanceOf(ReferenceError);
      expect(checkedAst.report.errors[0].message).toStartWith('unknownFunction is not defined');
    });

    test('should throw error when calling a non-function symbol', () => {
      const checkedAst = check(`
        let foo: number = 5;
        foo(10);
      `);

      expect(checkedAst.report.errors).toHaveLength(1);
      expect(checkedAst.report.errors[0]).toBeInstanceOf(TypeError);
      expect(checkedAst.report.errors[0].message).toStartWith("'foo: number' is not a function");
    });

    test('should enforce parameter type consistency in function calls', () => {
      const checkedAst = check(`
        fn add(a: number, b: number) -> number { return a + b; }
        let result: number = add("5", 10);
      `);

      expect(checkedAst.report.errors).toHaveLength(1);
      expect(checkedAst.report.errors[0]).toBeInstanceOf(TypeError);
      expect(checkedAst.report.errors[0].message).toStartWith("Expected type 'number', given 'string' at line 3:");
    });

    test('should ensure the correct number of parameters in function calls', () => {
      const checkedAst = check(`
        fn add(a: number, b: number) -> number { return a + b; }
        let result: number = add(5);
        result = add(5, 6, 7);
      `);

      expect(checkedAst.report.errors).toHaveLength(2);
      expect(checkedAst.report.errors[0]).toBeInstanceOf(Error);
      expect(checkedAst.report.errors[0].message).toStartWith("Expected 2 arguments, but got 1");

      expect(checkedAst.report.errors[1]).toBeInstanceOf(Error);
      expect(checkedAst.report.errors[1].message).toStartWith("Expected 2 arguments, but got 3");
    });
  })
}
