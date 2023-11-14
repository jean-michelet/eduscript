import Program from '../parser/Nodes/Program.js'

export interface AbstractCheckedProgramAttributes {
  errors: Error[]
}

export default class AbstractCheckedProgram {
  public readonly program: Program
  public readonly report: AbstractCheckedProgramAttributes

  constructor (program: Program, report: AbstractCheckedProgramAttributes) {
    this.program = program
    this.report = report
  }
}
