import AbstractExpression from '../../parser/Nodes/Expression/AbstractExpression.js'
import LiteralExpression, { Literal } from '../../parser/Nodes/Expression/LiteralExpression.js'
import Program from '../../parser/Nodes/Program.js'
import AbstractStatement from '../../parser/Nodes/Statement/AbstractStatement.js'
import BlockStatement from '../../parser/Nodes/Statement/BlockStatement.js'
import ExpressionStatement from '../../parser/Nodes/Statement/ExpressionStatement.js'
import { OP_CONST, OP_HALT } from '../instruction-set.js'

export class BytecodeProgram {
  public readonly instructions: Uint8Array
  public readonly constants: any[]

  constructor (instructions = new Uint8Array(), constants: Literal[] = []) {
    this.instructions = instructions
    this.constants = constants
  }
}

export default class BytecodeEmitter {
  private _instructions: Uint8Array = new Uint8Array()
  private _constants: Literal[] = []

  emit (program: Program): BytecodeProgram {
    this._instructions = new Uint8Array()
    this._constants = []

    this._emitBlockStmt(program.body.statements)

    this._push(OP_HALT)

    return new BytecodeProgram(this._instructions, this._constants)
  }

  _emitStmt (stmt: AbstractStatement): void {
    if (stmt instanceof BlockStatement) {
      this._emitBlockStmt(stmt.statements)
    }

    if (stmt instanceof ExpressionStatement) {
      this._emitExpr(stmt.expression)
    }
  }

  _emitBlockStmt (stmts: AbstractStatement[]): void {
    for (const stmt of stmts) {
      this._emitStmt(stmt)
    }
  }

  _emitExpr (expr: AbstractExpression): void {
    if (expr instanceof LiteralExpression) {
      this._push(OP_CONST)
      this._constants.push(expr.literal)
    }
  }

  _push (code: number): void {
    this._instructions = new Uint8Array([...this._instructions, code])
  }
}
