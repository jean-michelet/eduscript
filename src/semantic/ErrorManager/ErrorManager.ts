import { NodeSourceContext } from '../../parser/Nodes/AbstractNode.js'
import SourceFileManager from '../../scanner/SourceFileManager/SourceFileManager.js'

export default class ErrorManager {
  public readonly errors: Error[] = []
  private readonly _source: SourceFileManager

  constructor (source: SourceFileManager) {
    this._source = source
  }

  public addLogicError (message: string, sourceContext: NodeSourceContext): void {
    this._addError(new Error(message), sourceContext)
  }

  public addTypeError (message: string, sourceContext: NodeSourceContext): void {
    this._addError(new TypeError(message), sourceContext)
  }

  public addRefError (message: string, sourceContext: NodeSourceContext): void {
    this._addError(new ReferenceError(message), sourceContext)
  }

  private _addError (error: Error, sourceContext: NodeSourceContext): void {
    error.message += ` at line ${sourceContext.startLine}:${sourceContext.startTokenPos}`
    error.message += this._withToken(sourceContext)

    this.errors.push(error)
  }

  private _withToken (sourceContext: NodeSourceContext): string {
    return this._source.getLineWithToken(
      sourceContext.startLine,
      sourceContext.startTokenPos
    ).line
  }
}
