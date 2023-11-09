import AbstractNodeParser from '../../../Parser/AbstractNodeParser.js'
import { AST_NODE_TYPE } from '../../AstNode.js'
import AssignmentPattern from '../../Expression/AssignmentPattern.js'
import Identifier from '../../Expression/Identifier.js'
import BlockStatement from '../BlockStatement.js'
import FunctionDeclaration from '../FunctionDeclaration.js'
import Statement from '../Statement.js'
import { CLASS_MEMBER_VISIBILITY } from './ClassBody.js'

export default class MethodDefinition extends Statement {
  public readonly identifier: Identifier
  public readonly params: Array<Identifier | AssignmentPattern>
  public readonly body: BlockStatement
  public readonly isStatic: boolean
  public readonly visibility: CLASS_MEMBER_VISIBILITY

  constructor (
    identifier: Identifier,
    params: Array<Identifier | AssignmentPattern>,
    body: BlockStatement,
    isStatic: boolean,
    visibility: CLASS_MEMBER_VISIBILITY
  ) {
    super(AST_NODE_TYPE.METHOD_DEFINITION)
    this.identifier = identifier
    this.params = params
    this.body = body
    this.isStatic = isStatic
    this.visibility = visibility
  }

  static fromParser (parser: AbstractNodeParser,
    isStatic: boolean,
    visibility: CLASS_MEMBER_VISIBILITY): MethodDefinition {
    const fn = FunctionDeclaration.fromParser(parser)

    return new MethodDefinition(fn.identifier, fn.params, fn.body, isStatic, visibility)
  }
}
