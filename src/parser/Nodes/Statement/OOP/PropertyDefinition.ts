import { NodeSourceContext, AST_NODE_TYPE } from '../../AbstractNode.js'
import AbstractExpression from '../../Expression/AbstractExpression.js'
import Identifier from '../../Expression/Identifier.js'
import AbstractStatement from '../AbstractStatement.js'
import { CLASS_MEMBER_VISIBILITY } from './ClassBody.js'

export default class PropertyDefinition extends AbstractStatement {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.PROPERTY_DEFINITION
  public readonly identifier: Identifier
  public readonly init: AbstractExpression | null
  public readonly isStatic: boolean
  public readonly visibility: CLASS_MEMBER_VISIBILITY

  constructor (
    sourceContext: NodeSourceContext,
    id: Identifier,
    init: AbstractExpression | null,
    isStatic: boolean,
    visibility: CLASS_MEMBER_VISIBILITY
  ) {
    super(sourceContext)

    this.identifier = id
    this.init = init
    this.isStatic = isStatic
    this.visibility = visibility
  }
}
