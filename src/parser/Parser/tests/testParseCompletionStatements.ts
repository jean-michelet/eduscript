import FunctionDeclaration from '../../Nodes/Statement/FunctionDeclaration.js'
import ReturnStatement from '../../Nodes/Statement/JumpStatement/ReturnStatement.js'
import { parseStatements } from './Parser.test.js'
import WhileStatement from '../../Nodes/Statement/WhileStatement.js'
import BreakStatement from '../../Nodes/Statement/JumpStatement/BreakStatement.js'
import ContinueStatement from '../../Nodes/Statement/JumpStatement/ContinueStatement.js'
import LiteralExpression from '../../Nodes/Expression/LiteralExpression.js'

export default function (): void {
  describe('Test parse ReturnStatement', () => {
    test('should parse a function with ReturnStatement', () => {
      const stmts = parseStatements(`
        fn myFunction {
          return 1;
        }
      `)

      expect(stmts[0]).toBeInstanceOf(FunctionDeclaration)
      expect(stmts).toHaveLength(1)

      const myFunction = stmts[0] as FunctionDeclaration
      const returnStmt = myFunction.body.statements[0]
      expect(returnStmt).toBeInstanceOf(ReturnStatement)
      expect((returnStmt as ReturnStatement).expression).toBeInstanceOf(LiteralExpression)
    })

    test('should parse a function with empty ReturnStatement', () => {
      const stmts = parseStatements(`
        fn myFunction {
          return;
        }
      `)

      expect(stmts[0]).toBeInstanceOf(FunctionDeclaration)
      expect(stmts).toHaveLength(1)

      const myFunction = stmts[0] as FunctionDeclaration
      const returnStmt = myFunction.body.statements[0]
      expect(returnStmt).toBeInstanceOf(ReturnStatement)
      expect((returnStmt as ReturnStatement).expression).toBeNull()
    })

    test('should throw error when a ReturnStatement is outside a function', () => {
      expect(() => {
        parseStatements('return 1;')
      }).toThrow(new SyntaxError('"return" outside a function.'))
    })

    test('should throw error if a ReturnStatement is not followed by ;', () => {
      expect(() => {
        parseStatements(`
        fn myFunction {
          return
        }
      `)
      }).toThrow(new SyntaxError("Unexpected token '}' at line 4."))
    })
  })

  describe('Test parse BreakStatement', () => {
    test('should parse a loop with BreakStatement', () => {
      const stmts = parseStatements(`
        while true {
          break;
        }
      `)

      expect(stmts[0]).toBeInstanceOf(WhileStatement)
      expect(stmts).toHaveLength(1)

      const whileStatement = stmts[0] as WhileStatement
      const breakStmt = whileStatement.consequent.statements[0]

      expect(breakStmt).toBeInstanceOf(BreakStatement)
    })

    test('should parse a loop with BreakStatement and depth level', () => {
      const stmts = parseStatements(`
        while true {
          break 2;
        }
      `)

      expect(stmts[0]).toBeInstanceOf(WhileStatement)

      const whileStatement = stmts[0] as WhileStatement
      const breakStmt = whileStatement.consequent.statements[0] as BreakStatement

      expect(breakStmt.level).toBe(2)
    })

    test('should throw error when a BreakStatement is outside a loop', () => {
      expect(() => {
        parseStatements('break;')
      }).toThrow(new SyntaxError('Illegal "break" statement.'))

      expect(() => {
        parseStatements(`
          while true {
            fn a {
              break;
            }
          }
        `)
      }).toThrow(new SyntaxError('Illegal "break" statement.'))
    })

    test('should throw error if a BreakStatement is not followed by ;', () => {
      expect(() => {
        parseStatements(`
        while true {
            break
        }
      `)
      }).toThrow(new SyntaxError("Expected token 'SEMI_COLON', but found '}' at line 4."))
    })
  })

  describe('Test parse ContinueStatement', () => {
    test('should parse a loop with ContinueStatement', () => {
      const stmts = parseStatements(`
        while true {
          continue;
        }
      `)

      expect(stmts[0]).toBeInstanceOf(WhileStatement)
      expect(stmts).toHaveLength(1)

      const whileStatement = stmts[0] as WhileStatement
      const continueSttmt = whileStatement.consequent.statements[0]

      expect(continueSttmt).toBeInstanceOf(ContinueStatement)
    })

    test('should parse a loop with ContinueStatement and depth level', () => {
      const stmts = parseStatements(`
        while true {
          continue 2;
        }
      `)

      expect(stmts[0]).toBeInstanceOf(WhileStatement)

      const whileStatement = stmts[0] as WhileStatement
      const continueStmt = whileStatement.consequent.statements[0] as BreakStatement

      expect(continueStmt.level).toBe(2)
    })

    test('should throw error when a ContinueStatement is outside a loop', () => {
      expect(() => {
        parseStatements('continue;')
      }).toThrow(new SyntaxError('Illegal "continue" statement.'))

      expect(() => {
        parseStatements(`
          while true {
            fn a {
              continue;
            }
          }
        `)
      }).toThrow(new SyntaxError('Illegal "continue" statement.'))
    })

    test('should throw error if a ContinueStatement is not followed by ;', () => {
      expect(() => {
        parseStatements(`
        while true {
            continue
        }
      `)
      }).toThrow(new SyntaxError("Expected token 'SEMI_COLON', but found '}' at line 4."))
    })
  })
}
