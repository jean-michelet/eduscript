import { OP_HALT } from '../instruction-set.js'

export default class VM {
  private _ip: number = 0
  private _bytecodes: Uint8Array = new Uint8Array()

  constructor (bytecodes?: Uint8Array) {
    if (bytecodes != null) {
      this.loadBytecodes(bytecodes)
    }
  }

  loadBytecodes (bytecodes: Uint8Array): void {
    this._bytecodes = bytecodes
  }

  exec (): void {
    this._ip = 0

    while (this._ip < this._bytecodes.length) {
      const opcode = this._fetchByte()
      this._execByte(opcode)
    }
  }

  private _execByte (opcode: number): void {
    switch (opcode) {
      case OP_HALT:
        return // handle this operation
      default:
        throw new Error(`Unknown opcode ${opcode}`)
    }
  }

  private _fetchByte (): number {
    if (this._ip >= this._bytecodes.length) {
      throw new RangeError('Instruction pointer out of bounds')
    }

    return this._bytecodes[this._ip++]
  }

  // Method for testing purposes
  getIp (): number {
    return this._ip
  }
}
