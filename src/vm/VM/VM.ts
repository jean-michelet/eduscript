import { Literal } from '../../parser/Nodes/Expression/LiteralExpression.js'
import { ParserInterface } from '../../parser/Parser/Parser.js'
import BytecodeEmitter, { BytecodeProgram } from '../BytecodeEmitter/BytecodeEmitter.js'
import { OP_CONST, OP_HALT } from '../instruction-set.js'

export default class VM {
  private static readonly STACK_LIMIT = 1024
  private readonly _parser: ParserInterface
  private readonly _emitter: BytecodeEmitter
  private _ip: number = 0
  private _program: BytecodeProgram = new BytecodeProgram()
  private readonly _stack: Literal[] = []

  constructor (parser: ParserInterface, emitter: BytecodeEmitter) {
    this._parser = parser
    this._emitter = emitter
  }

  public exec (src: string): Literal {
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
        this._stackPush(this._program.constants.pop())
        break
      case OP_HALT:
        break
      default:
        throw new Error(`Unknown opcode ${opcode}`)
    }
  }

  private _fetchByte (): number {
    if (this._ip >= this._program.instructions.length) {
      throw new RangeError('Instruction pointer out of bounds')
    }

    return this._program.instructions[this._ip++]
  }

  private _stackPush (value: Literal): void {
    if (this._stack.length >= VM.STACK_LIMIT) {
      throw new Error('Stack overflow')
    }

    this._stack.push(value)
  }

  private _stackPop (): Literal {
    if (this._stack.length === 0) {
      throw new Error('Stack underflow')
    }

    return this._stack.pop()
  }
}
