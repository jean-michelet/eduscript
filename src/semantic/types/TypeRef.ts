import Identifier from '../../parser/Nodes/Expression/Identifier.js'
import Type from './Type.js'

export default class TypeRef extends Type {
  constructor (id: Identifier) {
    super(id.name)
  }
}
