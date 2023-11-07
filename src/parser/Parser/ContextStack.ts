export enum Context {
  TOP = 'TOP',
  LOOP = 'LOOP',
  FUNCTION = 'FUNCTION',
}

export default class ContextStack {
  _stack: Context[] = []

  enter (context: Context): void {
    this._stack.push(context)
  }

  leave (context: Context): void {
    const poped = this._stack.pop()
    if (poped !== context) {
      throw new TypeError(`Expected context value "${context.toString()}", but got "${poped ?? 'undefined'}" instead.`)
    }
  }

  in (context: Context): boolean {
    return this._stack.includes(context)
  }

  hasDirectParent (context: Context): boolean {
    return this._stack.slice(-1)[0] === context
  }
}
