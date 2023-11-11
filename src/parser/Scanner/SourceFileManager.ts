import { Token } from './Token.js'

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

  getLineInfo (lineNumber: number): LineInfo {
    if (!this._lines.has(lineNumber)) {
      throw new Error(`Invalid line number: ${lineNumber}`)
    }

    return this._lines.get(lineNumber) as LineInfo
  }

  getHighlightedLineInfo (lineNumber: number, token: Token): LineInfo {
    const lineInfo = this.getLineInfo(lineNumber)
    const start = token.startPos - lineInfo.startPos

    const cursor = ' '.repeat(lineInfo.line.length).substring(0, start) + '^'

    const line = `
      > ${lineInfo.line}
        ${cursor}
    `

    return { line, lineNumber: lineInfo.lineNumber, startPos: lineInfo.startPos, endPos: lineInfo.endPos }
  }
}
