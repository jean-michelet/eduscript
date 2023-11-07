import BinaryExpression from '../../Nodes/Expression/BinaryExpression.js'
import Identifier from '../../Nodes/Expression/Identifier.js'
import LiteralExpression from '../../Nodes/Expression/LiteralExpression.js'
import VariableDeclaration from '../../Nodes/Statement/VariableDeclaration.js'
import { parseStatements, testThrowErrorIfNotFollowedBySemiColon } from './Parser.test.js'

export default function (): void {
  describe('Test parse VariableDeclaration', () => {
    test('should parse a variable declaration', () => {
      const stmts = parseStatements('let a: boolean;')

      expect(stmts[0]).toBeInstanceOf(VariableDeclaration)
      expect(stmts).toHaveLength(1)

      const expr = stmts[0] as VariableDeclaration
      expect(expr.identifier.name).toBe('a')
      expect(expr.typeAnnotation.typedef).toBe('boolean')
      expect(expr.kind).toBe('let')
      expect(expr.init).toBe(null)
    })

    test('should parse a variable declaration with assignment', () => {
      const stmts = parseStatements('let a: Foo = 1;')
      expect(stmts).toHaveLength(1)

      expect(stmts[0]).toBeInstanceOf(VariableDeclaration)
      expect(stmts).toHaveLength(1)

      const expr = stmts[0] as VariableDeclaration
      expect(expr.typeAnnotation.typedef).toBeInstanceOf(Identifier)
      expect((expr.init as LiteralExpression).literal).toBe(1)
    })

    test('should parse a variable declaration with complex expression assignment', () => {
      const stmts = parseStatements('let a: number = 1 + 1;')
      expect(stmts).toHaveLength(1)

      expect(stmts[0]).toBeInstanceOf(VariableDeclaration)
      expect(stmts).toHaveLength(1)

      const expr = stmts[0] as VariableDeclaration
      expect(expr.init).toBeInstanceOf(BinaryExpression)
    })

    test('should parse a constant declaration', () => {
      const stmts = parseStatements('const a: number = 1;')
      expect(stmts).toHaveLength(1)

      expect(stmts[0]).toBeInstanceOf(VariableDeclaration)
      expect(stmts).toHaveLength(1)

      const expr = stmts[0] as VariableDeclaration
      expect(expr.identifier.name).toBe('a')
      expect(expr.kind).toBe('const')
      expect((expr.init as LiteralExpression).literal).toBe(1)
    })

    test('should throw error when constant declaration is not initialized', () => {
      expect(() => {
        parseStatements('const a: number;')
      }).toThrow(new SyntaxError('const declaration must be initialized.'))
    })

    test('should throw error when variable declaration is not typed', () => {
      expect(() => {
        parseStatements('const a;')
      }).toThrow(new SyntaxError("Expected token 'COLON', but found ';' at line 1."))
    })

    test('should throw error when variable type annotation is not present', () => {
      expect(() => {
        parseStatements('const a:;')
      }).toThrow(new SyntaxError("Expected type or identifier, but found ';' at line 1."))
    })

    testThrowErrorIfNotFollowedBySemiColon('let a: number = 1')
  })
}
