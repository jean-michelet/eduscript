export default class ParsingSequenceError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'ParsingSequenceError'
  }
}
