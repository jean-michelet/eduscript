import Parser from '../../parser/Parser/Parser.js'
import Scanner from '../../parser/Scanner/Scanner.js'
import { OP_CONST, OP_HALT } from '../instruction-set.js'
import BytecodeEmitter, { BytecodeProgram } from './BytecodeEmitter.js'

const emitter = new BytecodeEmitter()

const parser = new Parser(new Scanner())
export function emit (src: string): BytecodeProgram {
  const ast = parser.parse(src)
  return emitter.emit(ast)
}

describe('BytecodeEmitter', () => {
  test('should return OP_HALT from an empty program', () => {
    const program = emit('')

    expect(program.instructions[0]).toBe(OP_HALT)
    expect(program.constants).toHaveLength(0)
  })

  test('should return OP_CONST and store constants from an empty program', () => {
    const program = emit('1;')

    expect(program.instructions).toHaveLength(2)
    expect(program.instructions[0]).toBe(OP_CONST)

    expect(program.constants).toHaveLength(1)
    expect(program.constants[0]).toBe(1)
  })
})
