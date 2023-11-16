import Type from './Type.js'

export default class FunctionType extends Type {
  public readonly parameters: Type[]
  public readonly returnType: Type

  constructor (parameters: Type[], returnType: Type) {
    // e.i. fn(number,number)->number
    super(`fn(${parameters.map(p => p.name).join(',')})->${returnType.name}`)
    this.parameters = parameters
    this.returnType = returnType
  }
}
