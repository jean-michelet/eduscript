import { VariableKind } from '../parser/Nodes/Statement/VariableDeclaration.js'
import Type from '../semantic/types/Type.js'

export interface Symbol_ {
  id: string
  type: Type
  kind: VariableKind
}

export default class Scope {
  private readonly _symbols: Map<string, Symbol_> = new Map()

  define (symbol: Symbol_): void {
    if (this._symbols.has(symbol.id)) {
      throw new Error(`Variable '${symbol.id}' has already been declared in this scope.`)
    }

    this._symbols.set(symbol.id, symbol)
  }

  has (id: string): boolean {
    return this._symbols.has(id)
  }

  resolve (id: string): Symbol_ | null {
    return this._symbols.get(id) ?? null
  }
}
