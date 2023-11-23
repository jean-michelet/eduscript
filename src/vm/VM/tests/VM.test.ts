import Parser from '../../../parser/Parser/Parser.js'
import Scanner from '../../../scanner/Scanner/Scanner.js'
import BytecodeEmitter from '../../BytecodeEmitter/BytecodeEmitter.js'
import VM, { VmValue } from '../VM.js'
import testExecBinaryExpressions from './testExecBinaryExpressions.js'

const vm = new VM(new Parser(new Scanner()), new BytecodeEmitter())
export function vmExec (src: string): VmValue {
  return vm.exec(src)
}

describe('VM', () => {
  test('should execute empty program', () => {
    expect(vmExec('')).toBeUndefined()
  })

  test('should execute literal expressions', () => {
    expect(vmExec('1;')).toBe(1)
    expect(vmExec('"hello";')).toBe('hello')
    expect(vmExec('true;')).toBe(true)
    expect(vmExec('false;')).toBe(false)
    expect(vmExec('null;')).toBe(null)
    expect(vmExec('undefined;')).toBe(undefined)
  })

  test('exec should throw RangeError when instruction pointer goes out of bounds', () => {
    expect(() => vmExec('')).not.toThrow(RangeError)
  })

  testExecBinaryExpressions()
})
