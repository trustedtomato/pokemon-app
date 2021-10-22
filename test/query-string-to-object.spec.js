import { queryStringToObject } from '@/utils/query-string-to-object'

describe('query-string-to-object', () => {
  const base = {
    a: 'apple',
    b: 'banana',
    c: 1
  }

  test('creates empty object from empty string', () => {
    expect(queryStringToObject('', base)).toEqual({})
    expect(queryStringToObject('?', base)).toEqual({})
  })
  test('omits keys not existing on base', () => {
    expect(queryStringToObject('?d=coconut', base)).toEqual({})
    expect(queryStringToObject('e=epple', base)).toEqual({})
  })
  test('uses and converts keys to the type found on base', () => {
    expect(queryStringToObject('?a=ananas&c=3', base)).toEqual({ a: 'ananas', c: 3 })
    expect(queryStringToObject('a=ananas&c=3', base)).toEqual({ a: 'ananas', c: 3 })
  })
  test('is successful at complex scenarios too', () => {
    expect(queryStringToObject('?a=ananas&c=notanumber&d=3', base)).toEqual({ a: 'ananas', c: NaN })
  })
})
