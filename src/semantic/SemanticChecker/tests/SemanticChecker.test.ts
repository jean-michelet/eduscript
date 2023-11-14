import Parser from '../../../parser/Parser/Parser.js'
import Scanner from '../../../parser/Scanner/Scanner.js'
import SemanticChecker from '../SemanticChecker.js'
import testCheckBinaryOperations from './expressions/testCheckBinaryOperations.js'
import * as matchers from 'jest-extended'
import testCheckVariableDeclaration from './statements/testCheckVariableDeclaration.js'
expect.extend(matchers)

export const parser = new Parser(new Scanner())
export const checker = new SemanticChecker()

describe('SemanticChecker Tests', () => {
  testCheckBinaryOperations()

  testCheckVariableDeclaration()
})
