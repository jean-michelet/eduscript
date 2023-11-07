import LiteralExpression from '../../Nodes/Expression/LiteralExpression.js'
import WhileStatement from '../../Nodes/Statement/WhileStatement.js'
import { parseStatements } from './Parser.test.js'

export default function (): void {
  describe('Test parse WhileStatement', () => {
    test('should parse a WhileStatement', () => {
      const stmts = parseStatements(`
          while true {
            1 + 1;
            1 + 1;
          }
      `)

      const stmt = stmts[0] as WhileStatement

      expect(stmts[0]).toBeInstanceOf(WhileStatement)
      expect(stmts).toHaveLength(1)

      expect((stmt.test as LiteralExpression).literal).toBe(true)
      expect((stmt.body).statements).toHaveLength(2)
    })
  })
}
