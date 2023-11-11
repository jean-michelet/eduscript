export default class ContextMismatchError extends Error {
  constructor (expected: string, actual?: string) {
    super(`Expected context value "${expected}", but got "${actual ?? 'undefined'}" instead.`)
    this.name = 'ContextMismatchError'
  }
}
