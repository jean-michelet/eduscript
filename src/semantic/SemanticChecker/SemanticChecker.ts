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
import Env from '../../Env/Env.js'
import VariableDeclaration from '../../parser/Nodes/Statement/VariableDeclaration.js'
import Identifier from '../../parser/Nodes/Expression/Identifier.js'
import { TypeAnnotation } from '../../parser/Nodes/Expression/TypeAnnotation.js'
import { NodeSourceContext } from '../../parser/Nodes/AbstractNode.js'
import { Context } from '../../ContextStack/ContextStack.js'

class CheckedProgram extends AbstractCheckedProgram {}

export interface SemanticCheckerInterface {
  check: (program: Program) => CheckedProgram
}

export default class SemanticChecker implements SemanticCheckerInterface {
  private _errorHandler = new ErrorManager(new SourceFileManager(''))
  private _env: Env = new Env()

  public check (program: Program): CheckedProgram {
    this._errorHandler = new ErrorManager(program.source)
    this._env = new Env()

    this._env.enterScope(Context.TOP)
    this._checkStmtList(program.body.statements)
    this._env.leaveScope(Context.TOP)

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
    if (stmt instanceof VariableDeclaration) {
      this._checkVariableDeclaration(stmt)
    }

    if (stmt instanceof ExpressionStatement) {
      this._checkExpr(stmt.expression)
    }
  }

  private _checkExpr (expr: AbstractExpression): Type {
    if (expr instanceof LiteralExpression) {
      return new Type(expr.kind, expr.literal)
    }

    if (expr instanceof Identifier) {
      return this._checkVarAccess(expr)
    }

    if (expr instanceof TypeAnnotation) {
      if (expr.typedef instanceof Identifier) {
        return this._checkVarAccess(expr.typedef)
      }

      return new Type(expr.typedef)
    }

    if (expr instanceof BinaryExpression) {
      return this._checkBinaryExpression(expr)
    }

    if (expr instanceof ParenthesizedExpression) {
      return this._checkExpr(expr.expression)
    }

    throw new Error('Unexpected Expression of type ' + expr.type.toString())
  }

  private _checkVariableDeclaration (varStmt: VariableDeclaration): void {
    const id = varStmt.identifier.name
    if (this._env.hasSymbol(id)) {
      return this._errorHandler.addLogicError(`Cannot redeclare block-scoped variable '${id}'`, varStmt.sourceContext)
    }

    if (varStmt.kind === 'const' && varStmt.init === null) {
      this._errorHandler.addLogicError('\'const\' declarations must be initialized.', varStmt.identifier.sourceContext)
    }

    const type = this._checkExpr(varStmt.typeAnnotation)
    const init: Type = (varStmt.init != null) ? this._checkExpr(varStmt.init) : new Type(type.name)

    if ((varStmt.init != null) && type.name !== init.name) {
      this._notAssignableType(type, init, varStmt.init.sourceContext)
    }

    this._env.define({
      id,
      kind: varStmt.kind,
      type
    })
  }

  private _checkVarAccess (id: Identifier): Type {
    if (!this._env.hasSymbol(id.name)) {
      this._errorHandler.addRefError(`${id.name} is not defined`, id.sourceContext)

      return new Type('undefined')
    }

    return this._env.resolve(id.name).type
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

  private _notAssignableType (left: Type, right: Type, sourceContext: NodeSourceContext): void {
    this._errorHandler.addTypeError(`Type '${right.name}' is not assignable to type '${left.name}'`, sourceContext)
  }
}
