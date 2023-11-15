import BlockStatement from '../../../Nodes/Statement/BlockStatement.js'
import FunctionDeclaration from '../../../Nodes/Statement/FunctionDeclaration.js'
import { expectSourceContext, parseStatements } from '../Parser.test.js'

export default function (): void {
  describe('Test parse FunctionDeclaration', () => {
    test('should parse a function declaration without parameters', () => {
      const src = 'fn myFunction {}'
      const stmts = parseStatements(src)

      expect(stmts[0]).toBeInstanceOf(FunctionDeclaration)
      expectSourceContext(stmts[0], {
        endTokenPos: src.length
      })

      const myFunction = stmts[0] as FunctionDeclaration
      expect(myFunction.identifier.name).toBe('myFunction')
      expect(myFunction.params).toHaveLength(0)
      expect(myFunction.body).toBeInstanceOf(BlockStatement)
      expect(myFunction.body.statements).toHaveLength(0)
    })

    test('should parse a function declaration with parameters', () => {
      const fnSrc1 = 'fn myFunction a: number {}'
      const fnSrc2 = 'fn myFunction2 a: number, b: number = 1 + 1 {}'

      const stmts = parseStatements(fnSrc1 + fnSrc2)

      expect(stmts).toHaveLength(2)

      expect(stmts[0]).toBeInstanceOf(FunctionDeclaration)
      expectSourceContext(stmts[0], {
        endTokenPos: fnSrc1.length
      })

      const myFunction = stmts[0] as FunctionDeclaration
      expect(myFunction.identifier.name).toBe('myFunction')
      expect(myFunction.params).toHaveLength(1)

      expect(stmts[1]).toBeInstanceOf(FunctionDeclaration)
      expectSourceContext(stmts[1], {
        startTokenPos: fnSrc1.length,
        endTokenPos: fnSrc1.length + fnSrc2.length
      })

      const myFunction2 = stmts[1] as FunctionDeclaration
      expect(myFunction2.identifier.name).toBe('myFunction2')
      expect(myFunction2.params).toHaveLength(2)
      myFunction2.params.forEach(param => {
        expect(param.type.typedef.name).toBe('number')
      })
    })
  })
}
