import { debounce } from '@/utils/debounce'

describe('debounce', () => {
  test('debounces the given function', (done) => {
    expect.assertions(2)
    let n = 0
    const debounced = debounce(1000, () => {
      n++
    })
    debounced()
    debounced()
    expect(n).toBe(0)
    setTimeout(() => {
      expect(n).toBe(1)
      done()
    }, 1100)
  })
})
