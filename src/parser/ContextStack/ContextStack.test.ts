import ContextStack, { Context } from './ContextStack.js'

describe('ContextStack', () => {
  let contextStack = new ContextStack()

  beforeEach(() => {
    contextStack = new ContextStack()
  })

  describe('enter', () => {
    it('should push a new context onto the stack', () => {
      expect(contextStack.inContext(Context.LOOP)).toBeFalsy()
      contextStack.enter(Context.LOOP)
      expect(contextStack.inContext(Context.LOOP)).toBeTruthy()
    })
  })

  describe('leave', () => {
    it('should pop the last context from the stack', () => {
      contextStack.enter(Context.FUNCTION)
      expect(contextStack.inContext(Context.FUNCTION)).toBeTruthy()

      contextStack.leave(Context.FUNCTION)
      expect(contextStack.inContext(Context.FUNCTION)).toBeFalsy()
    })

    it('should throw an error if the context to leave does not match the last context', () => {
      contextStack.enter(Context.FUNCTION)
      expect(() => {
        contextStack.leave(Context.LOOP)
      }).toThrow('Expected context value "LOOP", but got "FUNCTION" instead.')
    })
  })

  describe('inContext', () => {
    it('should return true if the context is in the stack', () => {
      contextStack.enter(Context.TOP)
      expect(contextStack.inContext(Context.TOP)).toBeTruthy()
    })

    it('should return false if the context is not in the stack', () => {
      expect(contextStack.inContext(Context.LOOP)).toBeFalsy()
    })
  })

  describe('isCurrentContext', () => {
    it('should return true if the context is the current context', () => {
      contextStack.enter(Context.TOP)
      expect(contextStack.isCurrentContext(Context.TOP)).toBeTruthy()
    })

    it('should return false if the context is not the current context', () => {
      contextStack.enter(Context.TOP)
      contextStack.enter(Context.LOOP)
      expect(contextStack.isCurrentContext(Context.TOP)).toBeFalsy()
    })
  })
})
