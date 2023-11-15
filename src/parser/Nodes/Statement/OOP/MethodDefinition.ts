import { NodeSourceContext, AST_NODE_TYPE } from '../../AbstractNode.js'
import Identifier from '../../Expression/Identifier.js'
import AbstractStatement from '../AbstractStatement.js'
import BlockStatement from '../BlockStatement.js'
import { FunctionParameter } from '../FunctionDeclaration.js'
import { CLASS_MEMBER_VISIBILITY } from './ClassBody.js'

export default class MethodDefinition extends AbstractStatement {
  public type: AST_NODE_TYPE = AST_NODE_TYPE.METHOD_DEFINITION
  public readonly identifier: Identifier
  public readonly params: FunctionParameter[]
  public readonly body: BlockStatement
  public readonly isStatic: boolean
  public readonly visibility: CLASS_MEMBER_VISIBILITY

  constructor (
    sourceContext: NodeSourceContext,
    identifier: Identifier,
    params: FunctionParameter[],
    body: BlockStatement,
    isStatic: boolean,
    visibility: CLASS_MEMBER_VISIBILITY
  ) {
    super(sourceContext)
    this.identifier = identifier
    this.params = params
    this.body = body
    this.isStatic = isStatic
    this.visibility = visibility
  }
}
