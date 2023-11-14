import Parser from '../../../parser/Parser/Parser.js'
import Scanner from '../../../parser/Scanner/Scanner.js'
import SemanticChecker from '../SemanticChecker.js'
import testCheckBinaryOperations from './testCheckBinaryOperations.js'
import * as matchers from 'jest-extended'
expect.extend(matchers)

export const parser = new Parser(new Scanner())
export const checker = new SemanticChecker()

describe('SemanticChecker Tests', () => {
  testCheckBinaryOperations()
})
