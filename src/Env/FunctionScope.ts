import Type from '../semantic/types/Type.js'
import Scope from './Scope.js'

export default class FunctionScope extends Scope {
  public readonly returnType: Type

  constructor (returnType: Type) {
    super()
    this.returnType = returnType
  }
}
