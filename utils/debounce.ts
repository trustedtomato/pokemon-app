export function debounce<T extends unknown[]> (delay: number, callback: (...args: T) => void) {
  let timeoutHandler: ReturnType<typeof setTimeout> | null = null
  return function (...args: T) {
    if (timeoutHandler !== null) {
      clearTimeout(timeoutHandler)
    }
    // @ts-ignore
    timeoutHandler = setTimeout(() => callback.bind(this)(...args), delay)
  }
}
