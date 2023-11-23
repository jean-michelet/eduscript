interface LineInfo {
  line: string
  lineNumber: number
  startPos: number
  endPos: number
}

export default class SourceFileManager {
  private readonly _lines: Map<number, LineInfo>

  constructor (src: string) {
    let startPos = 0
    let lineNumber = 1

    this._lines = new Map()
    for (const line of src.split('\n')) {
      const endPos = startPos + line.length
      this._lines.set(lineNumber, { line, lineNumber, startPos, endPos })
      startPos += line.length + 1
      lineNumber++
    }
  }

  public getLineInfo (lineNumber: number): LineInfo {
    if (!this._lines.has(lineNumber)) {
      throw new Error(`Invalid line number: ${lineNumber}`)
    }

    return this._lines.get(lineNumber) as LineInfo
  }

  public getLineWithToken (lineNumber: number, startPos: number): LineInfo {
    const lineInfo = this.getLineInfo(lineNumber)

    const start = startPos - lineInfo.startPos

    return this._textWithCursor(lineInfo, start)
  }

  private _textWithCursor (lineInfo: LineInfo, start: number): { line: string, lineNumber: number, startPos: number, endPos: number } {
    const cursor = ' '.repeat(lineInfo.line.length).substring(0, start) + '^'

    const line = `
      > ${lineInfo.line}
        ${cursor}`

    return { line, lineNumber: lineInfo.lineNumber, startPos: lineInfo.startPos, endPos: lineInfo.endPos }
  }
}
