import Program from '../Nodes/Program.js'
import { ScannerInterface } from '../../scanner/Scanner/Scanner.js'
import AbstractNodeParser from './AbstractNodeParser.js'

export interface ParserInterface {
  parse: (input: string) => Program
}

class NodeParser extends AbstractNodeParser {}

export default class Parser implements ParserInterface {
  private readonly nodeParser: AbstractNodeParser

  constructor (scanner: ScannerInterface) {
    this.nodeParser = new NodeParser(scanner)
  }

  public parse (input: string): Program {
    return this.nodeParser.parse(input)
  }
}
