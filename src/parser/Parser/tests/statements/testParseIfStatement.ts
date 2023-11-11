import BinaryExpression from '../../../Nodes/Expression/BinaryExpression.js'
import LiteralExpression from '../../../Nodes/Expression/LiteralExpression.js'
import BlockStatement from '../../../Nodes/Statement/BlockStatement.js'
import IfStatement from '../../../Nodes/Statement/IfStatement.js'
import { expectSourceContext, parseStatements } from '../Parser.test.js'

export default function (): void {
  describe('Test parse IfStatement', () => {
    test('should parse a IfStatement without alternate', () => {
      const src = `if true == true {
        1 + 1;
        1 + 1;
      }`
      const stmts = parseStatements(src)

      const stmt = stmts[0] as IfStatement

      expect(stmts[0]).toBeInstanceOf(IfStatement)
      expectSourceContext(stmts[0], {
        endLine: 4,
        endTokenPos: src.length
      })

      expect(stmt.test).toBeInstanceOf(BinaryExpression)
      expect(stmt.consequent.statements).toHaveLength(2)
      expect(stmt.alternate).toBe(null)
    })

    test('should parse a IfStatement with alternate', () => {
      const src = `if true == false {
      } else {
        1 + 1;
        1 + 1;
      }`

      const stmts = parseStatements(src)

      const stmt = stmts[0] as IfStatement

      expect(stmts[0]).toBeInstanceOf(IfStatement)
      expectSourceContext(stmts[0], {
        endLine: 5,
        endTokenPos: src.length
      })

      expect(stmt.test).toBeInstanceOf(BinaryExpression)
      expect(stmt.consequent.statements).toHaveLength(0)
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
    const src = `if false {
    } else if true {
      1 + 1;
      1 + 1;
    } else {
      1 + 1;
    }`
    const stmts = parseStatements(src)
    expectSourceContext(stmts[0], {
      endLine: 7,
      endTokenPos: src.length
    })

    const stmt = stmts[0] as IfStatement

    expect(stmt.alternate).toBeInstanceOf(IfStatement)

    const alternate = stmt.alternate as IfStatement
    expect((alternate.test as LiteralExpression).literal).toBe(true)
    expect((alternate.consequent).statements).toHaveLength(2)

    expect(alternate.alternate).toBeInstanceOf(BlockStatement)
  })
}
