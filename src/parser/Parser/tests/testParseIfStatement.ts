import BinaryExpression from '../../Nodes/Expression/BinaryExpression.js'
import LiteralExpression from '../../Nodes/Expression/LiteralExpression.js'
import BlockStatement from '../../Nodes/Statement/BlockStatement.js'
import IfStatement from '../../Nodes/Statement/IfStatement.js'
import { parseStatements } from './Parser.test.js'

export default function (): void {
  describe('Test parse IfStatement', () => {
    test('should parse a IfStatement without alternate', () => {
      const stmts = parseStatements(`
          if true == true {
            1 + 1;
            1 + 1;
          }
        `)

      const stmt = stmts[0] as IfStatement

      expect(stmts[0]).toBeInstanceOf(IfStatement)
      expect(stmts).toHaveLength(1)

      expect(stmt.test).toBeInstanceOf(BinaryExpression)
      expect(stmt.consequent.statements).toHaveLength(2)
      expect(stmt.alternate).toBe(null)
    })

    test('should parse a IfStatement with alternate', () => {
      const stmts = parseStatements(`
          if true == false {

          } else {
            1 + 1;
            1 + 1;
          }
        `)

      const stmt = stmts[0] as IfStatement

      expect(stmts[0]).toBeInstanceOf(IfStatement)
      expect(stmts).toHaveLength(1)

      expect(stmt.test).toBeInstanceOf(BinaryExpression)
      expect(stmt.consequent.statements).toHaveLength(1) // EmptyStatement
      expect((stmt.alternate as BlockStatement).statements).toHaveLength(2)
    })
  })

  test('should parse a IfStatement with "else if" alternate', () => {
    /**
     * Expression is tranformed into:
      ```
      if false {

      } else {
        if true {
          1 + 1;
          1 + 1;
        } else {
          1 + 1;
        }
      }
      ```
     */
    const stmts = parseStatements(`
        if false {

        } else if true {
          1 + 1;
          1 + 1;
        } else {
          1 + 1;
        }
      `)

    const stmt = stmts[0] as IfStatement

    expect(stmt.alternate).toBeInstanceOf(IfStatement)

    const alternate = stmt.alternate as IfStatement
    expect((alternate.test as LiteralExpression).literal).toBe(true)
    expect((alternate.consequent).statements).toHaveLength(2)

    expect(alternate.alternate).toBeInstanceOf(BlockStatement)
  })
}
