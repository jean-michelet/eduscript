import ImportStatement from '../../../Nodes/Statement/ImportStatement.js'
import { expectSourceContext, parseStatements, testThrowErrorIfNotFollowedBySemiColon } from '../Parser.test.js'

export default function (): void {
  describe('Test parse ImportStatement', () => {
    test('should parse a ImportStatement', () => {
      const src = 'import "my/path/";'
      const stmts = parseStatements(src)

      expect(stmts[0]).toBeInstanceOf(ImportStatement)
      const stmt = stmts[0] as ImportStatement

      expectSourceContext(stmt, {
        endTokenPos: src.length
      })

      expect(stmt.path).toBe('my/path/')
    })

    testThrowErrorIfNotFollowedBySemiColon('import "my/path/"')
  })
}
