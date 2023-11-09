import BinaryExpression from '../parser/Nodes/Expression/BinaryExpression.js'
import Expression from '../parser/Nodes/Expression/Expression.js'
import LiteralExpression from '../parser/Nodes/Expression/LiteralExpression.js'
import Program from '../parser/Nodes/Program.js'
import ExpressionStatement from '../parser/Nodes/Statement/ExpressionStatement.js'
import Statement from '../parser/Nodes/Statement/Statement.js'
import AbstractCheckedProgram from './AbstractCheckedProgram.js'
import Type from './Type.js'

class CheckedProgram extends AbstractCheckedProgram {}

export interface SemanticCheckerInterface {
  check: (program: Program) => CheckedProgram
}

export default class SemanticChecker implements SemanticCheckerInterface {
  private _errors: string[] = []

  public check (program: Program): CheckedProgram {
    this._errors = []

    this._checkStmtList(program.body.statements)

    return new CheckedProgram(program, {
      errors: this._errors
    })
  }

  private _checkStmtList (stmts: Statement[]): void {
    for (const stmt of stmts) {
      this._checkStmt(stmt)
    }
  }

  private _checkStmt (stmt: Statement): void {
    if (stmt instanceof ExpressionStatement) {
      this._checkExpr(stmt.expression)
    }
  }

  private _checkExpr (expr: Expression): Type {
    if (expr instanceof BinaryExpression) {
      return this._checkBinaryExpression(expr)
    }

    if (expr instanceof LiteralExpression) {
      return new Type(expr.kind, expr.literal)
    }

    throw new Error('Unexpected Expression of type ' + expr.type.toString())
  }

  private _checkBinaryExpression (expr: BinaryExpression): Type {
    const left = this._checkExpr(expr.left)
    const right = this._checkExpr(expr.right)

    switch (expr.operator) {
      case '+':
      case '-':
      case '*':
      case '/':
        if (left.name !== 'number' || right.name !== 'number') {
          this._errors.push(`Type error: Operator '${expr.operator}' can only be applied to 'number' types.`)
        }

        if (expr.operator === '/' && right.value === 0) {
          this._errors.push('Semantic error: Division by zero is not allowed.')
        }
        return new Type('number')
      case '==':
      case '!=':
        if (left.name !== right.name) {
          this._errors.push(`Type error: Operator '${expr.operator}' requires operands of the same type, but got '${left.name}' and '${right.name}'.`)
        }

        break
      case '>':
      case '<':
      case '>=':
      case '<=':
        if (left.name !== 'number' || right.name !== 'number') {
          this._errors.push(`Type error: Operator '${expr.operator}' can only be applied to 'number' types.`)
        }

        break
      case '&&':
      case '||':
        if (left.name !== 'boolean' || right.name !== 'boolean') {
          this._errors.push(`Type error: Operator '${expr.operator}' can only be applied to 'boolean' types.`)
        }
    }

    return new Type('boolean')
  }

  _typeError (message: string): void {
    this._errors.push(`Type error: ${message}`)
  }
}
