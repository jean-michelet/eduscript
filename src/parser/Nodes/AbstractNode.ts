export interface NodeSourceContext {
  startLine: number
  endLine: number
  startTokenPos: number
  endTokenPos: number
}

export default abstract class AbstractNode {
  public abstract readonly type: AST_NODE_TYPE
  public readonly sourceContext: NodeSourceContext

  constructor (sourceContext: NodeSourceContext) {
    this.sourceContext = sourceContext
  }
}

export enum AST_NODE_TYPE {
  PROGRAM,

  // Expressions
  ARRAY_ACCESS_EXPRESSION,
  ARRAY_EXPRESSION,
  ASSIGNMENT_EXPRESSION,
  ASSIGNMENT_PATTERN,
  BINARY_EXPRESSION,
  CALL_EXPRESSION,
  EXPRESSION,
  IDENTIFIER,
  LEFT_HAND_SIDE_EXPRESSION,
  LITERAL_EXPRESSION,
  MEMBER_EXPRESSION,
  TYPE_ANNOTATION,

  // Declarations
  VARIABLE_DECLARATION,
  FUNCTION_DECLARATION,

  // Statements
  BREAK_STATEMENT,
  CONTINUE_STATEMENT,
  RETURN_STATEMENT,
  THROW_STATEMENT,
  BLOCK_STATEMENT,
  EMPTY_STATEMENT,
  EXPRESSION_STATEMENT,
  IF_STATEMENT,
  IMPORT_STATEMENT,
  WHILE_STATEMENT,

  // Object-Oriented Programming
  CLASS_BODY,
  CLASS_DECLARATION,
  METHOD_DEFINITION,
  PROPERTY_DEFINITION,
}
