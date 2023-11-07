import BlockStatement from '../../Nodes/Statement/BlockStatement.js'
import FunctionDeclaration from '../../Nodes/Statement/FunctionDeclaration.js'
import { parseStatements } from './Parser.test.js'

export default function (): void {
  describe('Test parse FunctionDeclaration', () => {
    test('should parse a function declaration without parameters', () => {
      const stmts = parseStatements(`
        fn myFunction {

        }`)

      expect(stmts[0]).toBeInstanceOf(FunctionDeclaration)
      expect(stmts).toHaveLength(1)

      const myFunction = stmts[0] as FunctionDeclaration
      expect(myFunction.identifier.name).toBe('myFunction')
      expect(myFunction.params).toHaveLength(0)
      expect(myFunction.body).toBeInstanceOf(BlockStatement)
      expect(myFunction.body.statements).toHaveLength(1) // EmptyStatement
    })

    test('should parse a function declaration with parameters', () => {
      const stmts = parseStatements(`
        fn myFunction a {

        }

        fn myFunction2 a, b = 1 + 1 {

        }
      `)

      expect(stmts[0]).toBeInstanceOf(FunctionDeclaration)
      expect(stmts).toHaveLength(2)

      const myFunction = stmts[0] as FunctionDeclaration
      expect(myFunction.identifier.name).toBe('myFunction')
      expect(myFunction.params).toHaveLength(1)

      expect(stmts[1]).toBeInstanceOf(FunctionDeclaration)

      const myFunction2 = stmts[1] as FunctionDeclaration
      expect(myFunction2.identifier.name).toBe('myFunction2')
      expect(myFunction2.params).toHaveLength(2)
    })
  })
}
