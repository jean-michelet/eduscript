import { Literal } from '../../parser/Nodes/Expression/LiteralExpression.js'

export default class Type {
  public readonly name: string
  public readonly value: Literal

  constructor (name: string, value: Literal = null) {
    this.name = name
    this.value = value
  }
}
