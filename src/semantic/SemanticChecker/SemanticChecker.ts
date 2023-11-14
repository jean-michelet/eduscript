import BinaryExpression from '../../parser/Nodes/Expression/BinaryExpression.js'
import LiteralExpression from '../../parser/Nodes/Expression/LiteralExpression.js'
import Program from '../../parser/Nodes/Program.js'
import AbstractCheckedProgram from '../AbstractCheckedProgram.js'
import Type from '../Type.js'
import AbstractStatement from '../../parser/Nodes/Statement/AbstractStatement.js'
import ExpressionStatement from '../../parser/Nodes/Statement/ExpressionStatement.js'
import AbstractExpression from '../../parser/Nodes/Expression/AbstractExpression.js'
import ParenthesizedExpression from '../../parser/Nodes/Expression/ParenthesizedExpression.js'
import ErrorManager from '../ErrorManager/ErrorManager.js'
import SourceFileManager from '../../parser/Scanner/SourceFileManager/SourceFileManager.js'

class CheckedProgram extends AbstractCheckedProgram {}

export interface SemanticCheckerInterface {
  check: (program: Program) => CheckedProgram
}

export default class SemanticChecker implements SemanticCheckerInterface {
  private _errorHandler = new ErrorManager(new SourceFileManager(''))

  public check (program: Program): CheckedProgram {
    this._errorHandler = new ErrorManager(program.source)

    this._checkStmtList(program.body.statements)

    return new CheckedProgram(program, {
      errors: this._errorHandler.errors
    })
  }

  private _checkStmtList (stmts: AbstractStatement[]): void {
    for (const stmt of stmts) {
      this._checkStmt(stmt)
    }
  }

  private _checkStmt (stmt: AbstractStatement): void {
    if (stmt instanceof ExpressionStatement) {
      this._checkExpr(stmt.expression)
    }
  }

  private _checkExpr (expr: AbstractExpression): Type {
    if (expr instanceof BinaryExpression) {
      return this._checkBinaryExpression(expr)
    }

    if (expr instanceof ParenthesizedExpression) {
      return this._checkExpr(expr.expression)
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
          this._errorHandler.addTypeError(`Operator '${expr.operator}' can only be applied to 'number' types`, expr.sourceContext)
        }

        if (expr.operator === '/' && right.value === 0) {
          this._errorHandler.addLogicError('Division by zero is not allowed.', expr.sourceContext)
        }
        return new Type('number')
      case '==':
      case '!=':
        if (left.name !== right.name) {
          this._errorHandler.addTypeError(`Operator '${expr.operator}' requires operands of the same type, but got '${left.name}' and '${right.name}'`, expr.sourceContext)
        }

        break
      case '>':
      case '<':
      case '>=':
      case '<=':
        if (left.name !== 'number' || right.name !== 'number') {
          this._errorHandler.addTypeError(`Operator '${expr.operator}' can only be applied to 'number' types`, expr.sourceContext)
        }

        break
      case '&&':
      case '||':
        if (left.name !== 'boolean' || right.name !== 'boolean') {
          this._errorHandler.addTypeError(`Operator '${expr.operator}' can only be applied to 'boolean' types`, expr.sourceContext)
        }
    }

    return new Type('boolean')
  }
}
