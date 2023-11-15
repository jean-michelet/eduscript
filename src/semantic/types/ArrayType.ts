import Type from './Type.js'

export default class ArrayType extends Type {
  public readonly type: Type
  constructor (type: Type) {
    super(type.name + '[]')

    this.type = type
  }
}
