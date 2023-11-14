import { NodeSourceContext } from '../../parser/Nodes/AbstractNode.js'
import SourceFileManager from '../../parser/Scanner/SourceFileManager/SourceFileManager.js'
import ErrorManager from './ErrorManager.js'
import * as matchers from 'jest-extended'
expect.extend(matchers)

describe('ErrorManager', () => {
  let errorManager: ErrorManager
  const src = 'let x = 1 + "hello";'
  const fileManager = new SourceFileManager(src)
  const sourceContext: NodeSourceContext = {
    startLine: 1,
    endLine: 1,
    startTokenPos: 8,
    endTokenPos: src.length
  }

  beforeEach(() => {
    errorManager = new ErrorManager(fileManager)
  })

  test('addLogicError adds a Logic Error with correct message and context', () => {
    errorManager.addLogicError('Logic error occurred', sourceContext)

    expect(errorManager.errors).toHaveLength(1)
    expect(errorManager.errors[0]).toBeInstanceOf(Error)
    expect(errorManager.errors[0].message).toContain(
    `Logic error occurred at line ${sourceContext.startLine}:${sourceContext.startTokenPos}
      > let x = 1 + "hello";`
    )
  })

  test('addTypeError adds a Type Error with correct message and context', () => {
    errorManager.addTypeError('Type error occurred', sourceContext)

    expect(errorManager.errors).toHaveLength(1)
    expect(errorManager.errors[0]).toBeInstanceOf(TypeError)
  })

  test('addRefError adds a Reference Error with correct message and context', () => {
    errorManager.addRefError('Reference error occurred', sourceContext)

    expect(errorManager.errors).toHaveLength(1)
    expect(errorManager.errors[0]).toBeInstanceOf(ReferenceError)
  })
})
