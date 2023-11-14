import ContextStack, { Context } from '../ContextStack/ContextStack.js'
import Scope, { Symbol_ } from './Scope.js'

export default class Env {
  private _scopePointer = 0
  private readonly _scopes: Map<number, Scope> = new Map()
  private readonly _contextStack: ContextStack = new ContextStack()

  hasSymbol (id: string): boolean {
    return this.getScope().resolve(id) !== null
  }

  define (symbol: Symbol_): void {
    this.getScope().define(symbol)
  }

  resolve (id: string): Symbol_ {
    let scopePointer = this._scopePointer

    while (scopePointer >= 0) {
      const scope = this._scopes.get(scopePointer)
      if (scope != null) {
        const symbol = scope.resolve(id)
        if (symbol != null) return symbol
      }
      scopePointer--
    }

    throw new ReferenceError(`Variable '${id}' is not defined`)
  }

  enterScope (context: Context = Context.BLOCK): void {
    this._scopes.set(++this._scopePointer, new Scope())
    this._contextStack.enter(context)
  }

  leaveScope (context: Context = Context.BLOCK): void {
    if (this._scopePointer < 1) {
      throw new Error('No scope to leave')
    }

    this._scopes.delete(this._scopePointer--)
    this._contextStack.leave(context)
  }

  getScope (): Scope {
    const scope = this._scopes.get(this._scopePointer)
    if (scope == null) {
      throw new Error('Scope not found')
    }

    return scope
  }
}
