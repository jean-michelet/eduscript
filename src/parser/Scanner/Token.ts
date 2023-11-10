export type TokenValue = string | number | null | undefined | boolean

export interface Token {
  type: TokenType
  lexeme: string
  value: TokenValue
  startLine: number
  endLine: number
  startPos: number
  endPos: number
}

export enum TokenType {
  // symbols
  DOT = 'DOT',
  COLON = 'COLON',
  SEMI_COLON = 'SEMI_COLON',
  COMA = 'COMA',
  LEFT_PAREN = 'LEFT_PAREN',
  RIGHT_PAREN = 'RIGHT_PAREN',
  LEFT_CBRACE = 'LEFT_CBRACE',
  RIGHT_CBRACE = 'RIGHT_CBRACE',
  LEFT_BRACKET = 'LEFT_BRACKET',
  RIGHT_BRACKET = 'RIGHT_BRACKET',

  // arithmetic operators
  ADDITIVE = 'ADDITIVE',
  MULTIPLICATIVE = 'MULTIPLICATIVE',

  // relational operators
  NOT = 'EQUAL',
  EQUAL = 'EQUAL',
  NOT_EQUAL = 'NOT_EQUAL',
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN',
  GREATER_EQUAL = 'GREATER_EQUAL',
  LESS_EQUAL = 'LESS_EQUAL',

  // logical operators
  LOGICAL_AND = 'LOGICAL_AND',
  LOGICAL_OR = 'LOGICAL_OR',

  // assignment operators
  ASSIGN = 'ASSIGN',

  // literals
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  BOOLEAN = 'BOOLEAN',

  // keywords
  LET = 'LET',
  CONST = 'CONST',
  CLASS = 'CLASS',
  EXTENDS = 'EXTENDS',
  STATIC = 'STATIC',
  PUBLIC = 'PUBLIC',
  PROTECTED = 'PROTECTED',
  PRIVATE = 'PRIVATE',
  THIS = 'THIS',
  FN = 'FN',
  IF = 'IF',
  ELSE = 'ELSE',
  ELSE_IF = 'ELSE_IF',
  FOR = 'FOR',
  WHILE = 'WHILE',
  RETURN = 'RETURN',
  BREAK = 'BREAK',
  CONTINUE = 'CONTINUE',
  IMPORT = 'IMPORT',
  EXPORT = 'EXPORT',

  BUILTIN_TYPE = 'BUILTIN_TYPE',

  // Identifier
  IDENTIFIER = 'IDENTIFIER',

  // Others
  EOF = 'EOF',
  INVALID = 'INVALID'
}
