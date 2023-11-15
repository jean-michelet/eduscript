import BinaryExpression from '../../parser/Nodes/Expression/BinaryExpression.js'
import LiteralExpression from '../../parser/Nodes/Expression/LiteralExpression.js'
import Program from '../../parser/Nodes/Program.js'
import AbstractCheckedProgram from '../AbstractCheckedProgram.js'
import Type from '../types/Type.js'
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
import AbstractNode from '../../parser/Nodes/AbstractNode.js'
import { Context } from '../../ContextStack/ContextStack.js'
import BlockStatement from '../../parser/Nodes/Statement/BlockStatement.js'
import { Symbol_ } from '../../Env/Scope.js'
import AssignmentExpression from '../../parser/Nodes/Expression/AssignmentExpression.js'
import IfStatement from '../../parser/Nodes/Statement/IfStatement.js'

class CheckedProgram extends AbstractCheckedProgram {}

export interface SemanticCheckerInterface {
  check: (program: Program) => CheckedProgram
}

export default class SemanticChecker implements SemanticCheckerInterface {
  private _errorManager = new ErrorManager(new SourceFileManager(''))
  private _env: Env = new Env()

  public check (program: Program): CheckedProgram {
    this._errorManager = new ErrorManager(program.source)
    this._env = new Env()

    this._env.enterScope(Context.TOP)
    this._checkStmtList(program.body.statements)
    this._env.leaveScope(Context.TOP)

    return new CheckedProgram(program, {
      errors: this._errorManager.errors
    })
  }

  private _checkStmtList (stmts: AbstractStatement[]): void {
    for (const stmt of stmts) {
      this._checkStmt(stmt)
    }
  }

  private _checkStmt (stmt: AbstractStatement): void {
    if (stmt instanceof BlockStatement) {
      this._env.enterScope()
      this._checkStmtList(stmt.statements)
      this._env.leaveScope()
    }
    if (stmt instanceof VariableDeclaration) {
      this._checkVariableDeclaration(stmt)
    }

    if (stmt instanceof IfStatement) {
      this._checkIf(stmt)
    }

    if (stmt instanceof ExpressionStatement) {
      this._checkExpr(stmt.expression)
    }
  }

  private _checkIf (stmt: IfStatement): void {
    this._checkExpectedType('boolean', this._checkExpr(stmt.test), stmt)

    this._checkStmt(stmt.consequent)

    if (stmt.alternate != null) {
      this._checkStmt(stmt.alternate)
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

      return expr.typedef
    }

    if (expr instanceof BinaryExpression) {
      return this._checkBinaryExpression(expr)
    }

    if (expr instanceof ParenthesizedExpression) {
      return this._checkExpr(expr.expression)
    }

    if (expr instanceof AssignmentExpression) {
      return this._checkAssignement(expr)
    }

    throw new Error('Unexpected Expression of type ' + expr.type.toString())
  }

  private _checkAssignement (expr: AssignmentExpression): Type {
    const left = this._checkExpr(expr.left)
    const right = this._checkExpr(expr.right)
    this._checkExpectedType(
      left.name,
      right,
      expr
    )

    return right
  }

  private _checkVariableDeclaration (varStmt: VariableDeclaration): void {
    const id = varStmt.identifier.name
    if (this._env.getScope().has(id)) {
      return this._errorManager.addLogicError(`Cannot redeclare block-scoped variable '${id}'`, varStmt.sourceContext)
    }

    if (varStmt.kind === 'const' && varStmt.init === null) {
      this._errorManager.addLogicError('\'const\' declarations must be initialized.', varStmt.identifier.sourceContext)
    }

    const type = this._checkExpr(varStmt.typeAnnotation)
    const init: Type = (varStmt.init !== null) ? this._checkExpr(varStmt.init) : new Type(type.name)

    if ((varStmt.init !== null)) {
      this._checkExpectedType(type.name, init, varStmt.init)
    }

    this._env.getScope().define({
      id,
      kind: varStmt.kind,
      type
    })
  }

  private _checkVarAccess (id: Identifier): Type {
    const symbol: Symbol_ | null = this._env.resolve(id.name)
    if (symbol == null) {
      this._errorManager.addRefError(`${id.name} is not defined`, id.sourceContext)

      return new Type('undefined')
    }

    return symbol.type
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
          this._errorManager.addTypeError(`Operator '${expr.operator}' can only be applied to 'number' types`, expr.sourceContext)
        }

        if (expr.operator === '/' && right.value === 0) {
          this._errorManager.addLogicError('Division by zero is not allowed.', expr.sourceContext)
        }
        return new Type('number')
      case '==':
      case '!=':
        if (left.name !== right.name) {
          this._errorManager.addTypeError(`Operator '${expr.operator}' requires operands of the same type, but got '${left.name}' and '${right.name}'`, expr.sourceContext)
        }

        break
      case '>':
      case '<':
      case '>=':
      case '<=':
        if (left.name !== 'number' || right.name !== 'number') {
          this._errorManager.addTypeError(`Operator '${expr.operator}' can only be applied to 'number' types`, expr.sourceContext)
        }

        break
      case '&&':
      case '||':
        if (left.name !== 'boolean' || right.name !== 'boolean') {
          this._errorManager.addTypeError(`Operator '${expr.operator}' can only be applied to 'boolean' types`, expr.sourceContext)
        }
    }

    return new Type('boolean')
  }

  private _checkExpectedType (expected: string, given: Type, node: AbstractNode): void {
    if (expected !== given.name) {
      this._errorManager.addTypeError(`Expected type '${expected}', given '${given.name}'`, node.sourceContext)
    }
  }
}
