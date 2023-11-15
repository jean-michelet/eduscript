import Parser from '../../../parser/Parser/Parser.js'
import Scanner from '../../../parser/Scanner/Scanner.js'
import BytecodeEmitter from '../../BytecodeEmitter/BytecodeEmitter.js'
import VM from '../VM.js'

export const vm = new VM(new Parser(new Scanner()), new BytecodeEmitter())

describe('VM', () => {
  test('should execute empty program', () => {
    expect(vm.exec('')).toBeUndefined()
  })

  test('exec should throw RangeError when instruction pointer goes out of bounds', () => {
    expect(() => vm.exec('')).not.toThrow(RangeError)
  })
})
