import Program from '../../Nodes/Program.js'
import Scanner from '../../Scanner/Scanner.js'
import Parser from '../Parser.js'
import testImportStatements from './testParseImportStatements.js'
import testParseAssignmentExpression from './testParseAssignmentExpression.js'
import testParseBinaryExpression from './testParseBinaryExpression.js'
import testParseCallExpression from './testParseCallExpression.js'
import testParseClassDeclaration from './testParseClassDeclaration.js'
import testParseCompletionStatements from './testParseCompletionStatements.js'
import testParseFunctionDeclaration from './testParseFunctionDeclaration.js'
import testParseIfStatement from './testParseIfStatement.js'
import testParseLiteralExpression from './testParseLiteralExpression.js'
import testParseVariableDeclaration from './testParseVariableDeclaration.js'
import BlockStatement from '../../Nodes/Statement/BlockStatement.js'
import EmptyStatement from '../../Nodes/Statement/EmptyStatement.js'
import ExpressionStatement from '../../Nodes/Statement/ExpressionStatement.js'
import Identifier from '../../Nodes/Expression/Identifier.js'
import Expression from '../../Nodes/Expression/Expression.js'
import AbstractStatement from '../../Nodes/Statement/AbstractStatement.js'
import testParseMemberExpression from './testParseMemberExpression.js'
import testParseArrayExpression from './testParseArrayExpression.js'
import testParseArrayAccessExpression from './testParseArrayAccessExpression.js'
import AbstractNode from '../../Nodes/AbstractNode.js'

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
  startFilePos: 0,
  startTokenPos: 0,
  endLine: 1,
  endTokenPos: 0,
  endFilePos: 0
}

export function expectSourceContext (node: AbstractNode, sourceContext: {
  startLine?: number
  startTokenPos?: number
  startFilePos?: number
  endLine?: number
  endTokenPos?: number
  endFilePos?: number
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

    expectSourceContext(stmts[0], { endFilePos: 1 })
  })

  test('should parse an empty block', () => {
    const stmts = parseStatements('{}')

    expect(stmts[0]).toBeInstanceOf(BlockStatement)
    expect(stmts).toHaveLength(1)

    expectSourceContext(stmts[0], { endTokenPos: 1, endFilePos: 2 })
  })

  test('should parse an identifier', () => {
    const expr = parseExpression('a;')

    expect(expr).toBeInstanceOf(Identifier)
  })

  testParseLiteralExpression()

  testParseBinaryExpression()

  testParseAssignmentExpression()

  testParseVariableDeclaration()

  testParseFunctionDeclaration()

  testParseCallExpression()

  testParseIfStatement()

  testParseCompletionStatements()

  testImportStatements()

  testParseClassDeclaration()

  testParseMemberExpression()

  testParseArrayExpression()

  testParseArrayAccessExpression()
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
