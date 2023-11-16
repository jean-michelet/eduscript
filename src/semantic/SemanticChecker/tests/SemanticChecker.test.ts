import Parser from '../../../parser/Parser/Parser.js'
import Scanner from '../../../parser/Scanner/Scanner.js'
import SemanticChecker from '../SemanticChecker.js'
import testCheckBinaryOperations from './expressions/testCheckBinaryOperations.js'
import * as matchers from 'jest-extended'
import testCheckVariableDeclaration from './statements/testCheckVariableDeclaration.js'
import AbstractCheckedProgram from '../../AbstractCheckedProgram.js'
import testCheckAssignement from './expressions/testCheckAssignement.js'
import testCheckIfStatement from './statements/testCheckIfStatement.js'
import testCheckFunctionDeclaration from './statements/testCheckFunctionDeclaration.js'
import testCompletionStatement from './statements/testCompletionStatement.js'
expect.extend(matchers)

const parser = new Parser(new Scanner())
const checker = new SemanticChecker()

export function check (src: string): AbstractCheckedProgram {
  const ast = parser.parse(src)

  return checker.check(ast)
}

describe('SemanticChecker Tests', () => {
  testCheckBinaryOperations()
  testCheckAssignement()

  testCheckVariableDeclaration()
  testCheckFunctionDeclaration()
  testCheckIfStatement()
  testCompletionStatement()
})
