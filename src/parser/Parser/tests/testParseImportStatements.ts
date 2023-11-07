import ImportStatement from '../../Nodes/Statement/ImportStatement.js'
import { parseStatements, testThrowErrorIfNotFollowedBySemiColon } from './Parser.test.js'

export default function (): void {
  describe('Test parse ImportStatement', () => {
    test('should parse a ImportStatement', () => {
      const stmts = parseStatements(`
          import "my/path/";
      `)

      const stmt = stmts[0] as ImportStatement

      expect(stmts[0]).toBeInstanceOf(ImportStatement)
      expect(stmts).toHaveLength(1)
      expect(stmt.path).toBe('my/path/')
    })

    testThrowErrorIfNotFollowedBySemiColon('import "my/path/"')
  })
}
