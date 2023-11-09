import { Literal } from '../parser/Nodes/Expression/LiteralExpression.js'
import { BuiltinType } from '../parser/Nodes/Expression/TypeAnnotation.js'

export default class Type {
  public readonly name: BuiltinType
  public readonly value: Literal

  constructor (name: BuiltinType, value: Literal = null) {
    this.name = name
    this.value = value
  }
}
