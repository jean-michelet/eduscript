import ArrayType from '../../../../semantic/types/ArrayType.js'
import TypeRef from '../../../../semantic/types/TypeRef.js'
import BinaryExpression from '../../../Nodes/Expression/BinaryExpression.js'
import LiteralExpression from '../../../Nodes/Expression/LiteralExpression.js'
import VariableDeclaration from '../../../Nodes/Statement/VariableDeclaration.js'
import { expectSourceContext, parseStatements, testThrowErrorIfNotFollowedBySemiColon } from '../Parser.test.js'

export default function (): void {
  describe('Test parse VariableDeclaration', () => {
    test('should parse a variable declaration', () => {
      const src = 'let a: boolean; let a: Foo[] = 1;'
      const stmts = parseStatements(src)

      expect(stmts[0]).toBeInstanceOf(VariableDeclaration)
      let expr = stmts[0] as VariableDeclaration
      expect(expr.identifier.name).toBe('a')
      expect(expr.typedef.name).toBe('boolean')
      expect(expr.kind).toBe('let')
      expect(expr.init).toBe(null)

      expectSourceContext(expr, {
        endTokenPos: 'let a: boolean;'.length
      })

      expr = stmts[1] as VariableDeclaration
      expect(expr.typedef).toBeInstanceOf(ArrayType)
      expect((expr.typedef as ArrayType).type).toBeInstanceOf(TypeRef)
      expect(expr.typedef.name).toBe('Foo[]')
      expect((expr.init as LiteralExpression).literal).toBe(1)
      expectSourceContext(expr, {
        startTokenPos: 'let a: boolean;'.length + 1,
        endTokenPos: src.length
      })
    })

    test('should parse variable declarations with assignment', () => {
      const stmts = parseStatements('let a: Foo = 1;')

      expect(stmts).toHaveLength(1)

      expect(stmts[0]).toBeInstanceOf(VariableDeclaration)

      const expr = stmts[0] as VariableDeclaration
      expect(expr.typedef).toBeInstanceOf(TypeRef)
      expect(expr.typedef.name).toBe('Foo')
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

    test('should throw error when variable declaration is not typed', () => {
      expect(() => {
        parseStatements('const a;')
      }).toThrow(new SyntaxError("Expected token 'COLON', but found ';' at line 1."))
    })

    testThrowErrorIfNotFollowedBySemiColon('let a: number = 1')
  })
}
