import Parser from './parser/Parser/Parser.js'
import Scanner from './parser/Scanner/Scanner.js'

const parser = new Parser(new Scanner())

const ast = parser.parse('1 + 2 * 3;')
console.log(JSON.stringify(ast.body.statements[0], null, 2))
