import Program from '../../Nodes/Program.js'
import Scanner from '../../Scanner/Scanner.js'
import Parser from '../Parser.js'
import testImportStatements from './statements/testParseImportStatements.js'
import testParseAssignmentExpression from './expressions/testParseAssignmentExpression.js'
import testParseBinaryExpression from './expressions/testParseBinaryExpression.js'
import testParseCallExpression from './expressions/testParseCallExpression.js'
import testParseClassDeclaration from './statements/testParseClassDeclaration.js'
import testParseCompletionStatements from './statements/testParseCompletionStatements.js'
import testParseFunctionDeclaration from './statements/testParseFunctionDeclaration.js'
import testParseIfStatement from './statements/testParseIfStatement.js'
import testParseLiteralExpression from './expressions/testParseLiteralExpression.js'
import testParseVariableDeclaration from './statements/testParseVariableDeclaration.js'
import BlockStatement from '../../Nodes/Statement/BlockStatement.js'
import EmptyStatement from '../../Nodes/Statement/EmptyStatement.js'
import ExpressionStatement from '../../Nodes/Statement/ExpressionStatement.js'
import Identifier from '../../Nodes/Expression/Identifier.js'
import Expression from '../../Nodes/Expression/Expression.js'
import AbstractStatement from '../../Nodes/Statement/AbstractStatement.js'
import testParseMemberExpression from './expressions/testParseMemberExpression.js'
import testParseArrayExpression from './expressions/testParseArrayExpression.js'
import testParseArrayAccessExpression from './expressions/testParseArrayAccessExpression.js'
import AbstractNode from '../../Nodes/AbstractNode.js'
import VariableDeclaration from '../../Nodes/Statement/VariableDeclaration.js'

const parser = new Parser(new Scanner())

export function testThrowErrorIfNotFollowedBySemiColon (stmt: string): void {
  test(`should throw error if ${stmt} is not followed by ;`, () => {
    expect(() => {
      parseStatements(stmt)
    }).toThrow(new SyntaxError('Unexpected end of line.'))
  })
}

const defaultSourceContext = {
  startLine: 1,
  startTokenPos: 0,
  endLine: 1,
  endTokenPos: 0
}

export function expectSourceContext (node: AbstractNode, sourceContext: {
  startLine?: number
  startTokenPos?: number
  endLine?: number
  endTokenPos?: number
} = {}): void {
  expect(node.sourceContext).toEqual({ ...defaultSourceContext, ...sourceContext })
}

describe('Parser Tests', () => {
  test('should parse an empty program', () => {
    const ast = parser.parse('')

    expect(ast).toBeInstanceOf(Program)
    expect(ast.body).toBeInstanceOf(BlockStatement)
    expect(ast.body.statements).toHaveLength(0)

    expectSourceContext(ast)
  })

  test('should parse an empty statement', () => {
    const stmts = parseStatements(';')

    expect(stmts).toHaveLength(1)
    expect(stmts[0]).toBeInstanceOf(EmptyStatement)

    expectSourceContext(stmts[0], { endTokenPos: 1 })
  })

  test('should parse an empty block', () => {
    const stmts = parseStatements('{}')

    expect(stmts[0]).toBeInstanceOf(BlockStatement)
    expect(stmts).toHaveLength(1)

    expectSourceContext(stmts[0], { endTokenPos: 2 })
  })

  test('should parse an identifier', () => {
    const expr = parseExpression('a;')

    expect(expr).toBeInstanceOf(Identifier)
  })

  // expressions
  testParseLiteralExpression()

  testParseBinaryExpression()

  testParseAssignmentExpression()

  testParseCallExpression()

  testParseMemberExpression()

  testParseArrayExpression()

  testParseArrayAccessExpression()

  // statements
  testParseVariableDeclaration()

  testParseFunctionDeclaration()

  testParseIfStatement()

  testParseCompletionStatements()

  testImportStatements()

  testParseClassDeclaration()

  test('sourceContext', () => {
    const varDeclarationSrc = 'let x: number = 1;'
    const suffix = '\n\n    '
    const src = `

  ${varDeclarationSrc}${suffix}`
    const stmts = parseStatements(src)

    expect(stmts[0]).toBeInstanceOf(VariableDeclaration)

    expectSourceContext(stmts[0], {
      startLine: 3,
      endLine: 3,
      startTokenPos: 4,
      endTokenPos: src.length - suffix.length
    })

    // const assignExpr = (stmts[0] as VariableDeclaration).init as AssignmentExpression

    // expectSourceContext(assignExpr, {
    //   startLine: 3,
    //   endLine: 5,
    //   startTokenPos: 8,
    //   endTokenPos: src.length - suffix.length - 1
    // })
  })
})

export function parseStatements (src: string): AbstractStatement[] {
  const ast = parser.parse(src)
  return ast.body.statements
}

export function parseExpression (src: string): Expression {
  const stmts = parseStatements(src)

  expect(stmts).toHaveLength(1)
  expect(stmts[0]).toBeInstanceOf(ExpressionStatement)

  return (stmts[0] as ExpressionStatement).expression
}
