import { check } from '../SemanticChecker.test.js'

export default function (): void {
  describe('If statement', () => {
    test('should allow boolean type for test', () => {
      const checkedAst = check(`
      const test: boolean = true;
        if (test) {

        } else if (test) {

        }
      `)

      expect(checkedAst.report.errors).toHaveLength(0)
    })

    test('should not allow non boolean type for test', () => {
      const checkedAst = check(`
      const test: string = "hello";
        if (test) {

        } else if (test) {
          
        }
      `)

      expect(checkedAst.report.errors).toHaveLength(2)
      checkedAst.report.errors.forEach(error => {
        expect(error).toBeInstanceOf(TypeError)
      })
    })

    test('should check consequent and alternate parts', () => {
      const checkedAst = check(`
      const test: boolean = true;
        if (test) {
          undeclaredVar;
        } else if (test) {
          undeclaredVar;
        } else {
          undeclaredVar;
        }
      `)

      expect(checkedAst.report.errors).toHaveLength(3)
      checkedAst.report.errors.forEach(error => {
        expect(error).toBeInstanceOf(ReferenceError)
      })
    })
  })
}
