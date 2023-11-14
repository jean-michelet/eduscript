import ContextMismatchError from './errors/ContextMismatchError.js'

export enum Context {
  TOP = 'TOP',
  BLOCK = 'BLOCK',
  LOOP = 'LOOP',
  FUNCTION = 'FUNCTION',
  CLASS = 'CLASS',
}

export default class ContextStack {
  private readonly _stack: Context[] = []

  enter (context: Context): void {
    this._stack.push(context)
  }

  leave (context: Context): void {
    const popped = this._stack.pop()
    if (popped !== context) {
      throw new ContextMismatchError(context.toString(), popped)
    }
  }

  inContext (context: Context): boolean {
    return this._stack.includes(context)
  }

  isCurrentContext (context: Context): boolean {
    return this._stack.slice(-1)[0] === context
  }
}
