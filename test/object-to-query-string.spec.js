import { objectToQueryString } from '@/utils/object-to-query-string'

describe('object-to-query-string', () => {
  test('converts empty object ot query string', () => {
    expect(objectToQueryString({})).toBe('')
  })
  test('converts not-empty object ot query string', () => {
    expect(objectToQueryString({ a: 'apple', b: 'banana' })).toBe('a=apple&b=banana')
  })
})
