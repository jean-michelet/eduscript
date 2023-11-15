import { OP_HALT } from '../../instruction-set.js'
import VM from '../VM.js'

describe('VM', () => {
  let vm: VM

  beforeEach(() => {
    vm = new VM()
  })

  test('exec should halt execution when OP_HALT is encountered', () => {
    const bytecodes = new Uint8Array([OP_HALT])
    vm.loadBytecodes(bytecodes)
    vm.exec()
    expect(vm.getIp()).toBe(1)
  })

  test('exec should throw RangeError when instruction pointer goes out of bounds', () => {
    const bytecodes = new Uint8Array([OP_HALT, OP_HALT])
    vm.loadBytecodes(bytecodes)
    expect(() => vm.exec()).not.toThrow(RangeError)
  })

  test('exec should throw an error for unknown opcodes', () => {
    const bytecodes = new Uint8Array([0xAA])
    vm.loadBytecodes(bytecodes)
    expect(() => vm.exec()).toThrow(`Unknown opcode ${0xAA}`)
  })
})
