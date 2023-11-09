import Program from '../parser/Nodes/Program.js'

export interface AbstractCheckedProgramAttributes {
  errors: string[]
}

export default class AbstractCheckedProgram {
  public readonly program: Program
  public readonly attributes: AbstractCheckedProgramAttributes

  constructor (program: Program, attributes: AbstractCheckedProgramAttributes) {
    this.program = program
    this.attributes = attributes
  }
}
