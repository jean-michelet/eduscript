import Type from '../semantic/types/Type.js'

export type SymboleKind = 'let' | 'const' | 'function' | 'class'

export interface Symbol_ {
  id: string
  type: Type
  kind: SymboleKind
  visibility?: 'public' | 'private' | 'protected'
  isStatic?: boolean
}

export default class Scope {
  protected readonly _symbols: Map<string, Symbol_> = new Map()

  define (symbol: Symbol_): void {
    if (this._symbols.has(symbol.id)) {
      throw new Error(`Id '${symbol.id}' is already in use in this scope.`)
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
