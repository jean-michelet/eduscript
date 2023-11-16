import { vmExec } from './VM.test.js'

export default function (): void {
  describe('Test exec BinaryExpression', () => {
    const basicBinaryExpressions = [
      ['1 + 2', 3],
      ['1 - 2', -1],
      ['1 * 2', 2],
      ['1 / 2', 0.5],

      ['1 > 2', false],
      ['1 < 2', true],
      ['1 >= 2', false],
      ['1 <= 2', true],

      ['true && true', true],
      ['true || false', true]
    ] satisfies Array<[string, number | boolean]>

    basicBinaryExpressions.forEach(([src, expected]) => {
      test(`should evaluate binary expression "${src}" to ${expected.toString()}`, () => {
        const result = vmExec(src + ';')
        expect(result).toBe(expected)
      })
    })

    const precedenceBinaryOperations = [
      ['2 * 2 + 1', 5],
      ['4 / 2 + 3', 5],
      ['1 * 2 - 3', -1],
      ['1 / 2 - 3', -2.5],

      ['1 + 2 > 3', false],
      ['1 - 2 > 3', false],
      ['1 + 1 < 3', true],
      ['3 - 1 < 3', true],
      ['1 + 2 >= 3', true],
      ['1 - 2 >= 3', false],
      ['1 + 2 <= 3', true],
      ['1 - 2 <= 3', true],

      ['1 > 2 == true', false],
      ['1 > 2 != true', true],
      ['1 < 2 == 3', false],
      ['1 < 2 != 3', true],
      ['1 >= 2 == 3', false],
      ['1 >= 2 != 3', true],
      ['1 <= 2 == 3', false],
      ['1 <= 2 != 3', true],

      ['true == false && true', false],
      ['true != false && true', true],

      ['true && false || true', true]
    ] satisfies Array<[string, number | boolean]>

    precedenceBinaryOperations.forEach(([src, expected]) => {
      test(`should evaluate binary expression "${src}" with correct precedence, expected: ${expected.toString()}`, () => {
        const result = vmExec(src + ';')
        expect(result).toBe(expected)
      })
    })

    test('should evaluate complex binary expression', () => {
      expect(vmExec('(1 + 2) * 2 + (6 / 3);')).toBe(8)
    })
  })
}
