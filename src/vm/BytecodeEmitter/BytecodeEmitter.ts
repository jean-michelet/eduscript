import AbstractExpression from '../../parser/Nodes/Expression/AbstractExpression.js'
import BinaryExpression, { BinaryOperator } from '../../parser/Nodes/Expression/BinaryExpression.js'
import LiteralExpression, { Literal } from '../../parser/Nodes/Expression/LiteralExpression.js'
import Program from '../../parser/Nodes/Program.js'
import AbstractStatement from '../../parser/Nodes/Statement/AbstractStatement.js'
import BlockStatement from '../../parser/Nodes/Statement/BlockStatement.js'
import ExpressionStatement from '../../parser/Nodes/Statement/ExpressionStatement.js'
import { OP_ADD, OP_AND, OP_CONST, OP_DIV, OP_EQ, OP_GT, OP_GTE, OP_HALT, OP_LT, OP_LTE, OP_MUL, OP_NEQ, OP_OR, OP_SUB } from '../instruction-set.js'

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
    if (expr instanceof BinaryExpression) {
      this._emitBinaryExpr(expr)
    }

    if (expr instanceof LiteralExpression) {
      this._push(OP_CONST)
      this._constants.push(expr.literal)
    }
  }

  _emitBinaryExpr (expr: BinaryExpression): void {
    this._emitExpr(expr.left)
    this._emitExpr(expr.right)
    this._emitBinaryOperator(expr.operator)
  }

  _emitBinaryOperator (op: BinaryOperator): void {
    switch (op) {
      case '+':
        this._push(OP_ADD)
        break
      case '-':
        this._push(OP_SUB)
        break
      case '*':
        this._push(OP_MUL)
        break
      case '/':
        this._push(OP_DIV)
        break
      case '>':
        this._push(OP_GT)
        break
      case '<':
        this._push(OP_LT)
        break
      case '>=':
        this._push(OP_GTE)
        break
      case '<=':
        this._push(OP_LTE)
        break
      case '==':
        this._push(OP_EQ)
        break
      case '!=':
        this._push(OP_NEQ)
        break
      case '&&':
        this._push(OP_AND)
        break
      case '||':
        this._push(OP_OR)
        break
    }
  }

  _push (code: number): void {
    this._instructions = new Uint8Array([...this._instructions, code])
  }
}
