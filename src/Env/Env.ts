import ContextStack, { Context } from '../ContextStack/ContextStack.js'
import FunctionDeclaration from '../parser/Nodes/Statement/FunctionDeclaration.js'
import FunctionScope from './FunctionScope.js'
import Scope, { Symbol_ } from './Scope.js'

export default class Env {
  private _scopePointer = 0
  private readonly _scopes: Map<number, Scope> = new Map()
  public readonly contextStack: ContextStack = new ContextStack()

  resolve (id: string): Symbol_ | null {
    let scopePointer = this._scopePointer
    while (scopePointer > 0) {
      const scope = this._scopes.get(scopePointer)
      if (scope != null) {
        const symbol = scope.resolve(id)
        if (symbol != null) return symbol
      }
      scopePointer--
    }

    return null
  }

  enterScope (context: Context = Context.BLOCK): void {
    this.contextStack.enter(context)
    this._scopes.set(++this._scopePointer, new Scope())
  }

  enterFunctionScope (fnStmt: FunctionDeclaration): void {
    this.contextStack.enter(Context.FUNCTION)
    this._scopes.set(++this._scopePointer, new FunctionScope(fnStmt.returnType))
  }

  leaveScope (context: Context = Context.BLOCK): void {
    if (this._scopePointer < 1) {
      throw new Error('No scope to leave')
    }

    this._scopes.delete(this._scopePointer--)
    this.contextStack.leave(context)
  }

  getScope (): Scope {
    const scope = this._scopes.get(this._scopePointer)
    if (scope == null) {
      throw new Error('Scope not found')
    }

    return scope
  }
}
