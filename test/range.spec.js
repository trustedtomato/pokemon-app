import { range } from '@/utils/range'

describe('range', () => {
  test('creates a range from 2 to 5 with 1 increments successfully', () => {
    expect(range(2, 5, 1)).toEqual([2, 3, 4])
  })
  test('creates a range from 2 to 5 with 2 increments successfully', () => {
    expect(range(2, 5, 2)).toEqual([2, 4])
  })
})
