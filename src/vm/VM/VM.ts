import { Literal } from '../../parser/Nodes/Expression/LiteralExpression.js'
import { ParserInterface } from '../../parser/Parser/Parser.js'
import BytecodeEmitter, { BytecodeProgram } from '../BytecodeEmitter/BytecodeEmitter.js'
import { OP_ADD, OP_AND, OP_CONST, OP_DIV, OP_EQ, OP_GT, OP_GTE, OP_HALT, OP_LT, OP_LTE, OP_MUL, OP_NEQ, OP_OR, OP_SUB } from '../instruction-set.js'

export type VmValue = Literal

export default class VM {
  private static readonly STACK_LIMIT = 1024
  private readonly _parser: ParserInterface
  private readonly _emitter: BytecodeEmitter
  private _ip: number = 0
  private _program: BytecodeProgram = new BytecodeProgram()
  private readonly _stack: VmValue[] = []

  constructor (parser: ParserInterface, emitter: BytecodeEmitter) {
    this._parser = parser
    this._emitter = emitter
  }

  public exec (src: string): VmValue {
    const ast = this._parser.parse(src)
    this._program = this._emitter.emit(ast)

    this._ip = 0

    while (this._ip < this._program.instructions.length) {
      const opcode = this._fetchByte()
      this._execByte(opcode)
    }

    return this._stack.length > 0 ? this._stackPop() : undefined
  }

  private _execByte (opcode: number): void {
    switch (opcode) {
      case OP_CONST:
        this._stackPush(this._program.constants.shift())
        break
      case OP_ADD:
        this._execBinaryOperation<number, number>((a, b) => a + b)
        break
      case OP_SUB:
        this._execBinaryOperation<number, number>((a, b) => a - b)
        break
      case OP_MUL:
        this._execBinaryOperation<number, number>((a, b) => a * b)
        break
      case OP_DIV:
        this._execBinaryOperation<number, number>((a, b) => a / b)
        break
      case OP_GT:
        this._execBinaryOperation<number, boolean>((a, b) => a > b)
        break
      case OP_LT:
        this._execBinaryOperation<number, boolean>((a, b) => a < b)
        break
      case OP_GTE:
        this._execBinaryOperation<number, boolean>((a, b) => a >= b)
        break
      case OP_LTE:
        this._execBinaryOperation<number, boolean>((a, b) => a <= b)
        break
      case OP_EQ:
        this._execBinaryOperation<number, boolean>((a, b) => a === b)
        break
      case OP_NEQ:
        this._execBinaryOperation<number, boolean>((a, b) => a !== b)
        break
      case OP_AND:
        this._execBinaryOperation<boolean, boolean>((a, b) => a && b)
        break
      case OP_OR:
        this._execBinaryOperation<boolean, boolean>((a, b) => a || b)
        break
      case OP_HALT:
        break
      default:
        throw new Error(`Unknown opcode ${opcode}`)
    }
  }

  private _execBinaryOperation<T extends VmValue, R extends VmValue>(operation: (a: T, b: T) => R): void {
    const right = this._stackPop() as T
    const left = this._stackPop() as T

    this._stackPush(operation(left, right))
  }

  private _fetchByte (): number {
    if (this._ip >= this._program.instructions.length) {
      throw new RangeError('Instruction pointer out of bounds')
    }

    return this._program.instructions[this._ip++]
  }

  private _stackPush (value: VmValue): void {
    if (this._stack.length >= VM.STACK_LIMIT) {
      throw new Error('Stack overflow')
    }

    this._stack.push(value)
  }

  private _stackPop (): VmValue {
    if (this._stack.length === 0) {
      throw new Error('Stack underflow')
    }

    return this._stack.pop()
  }
}
