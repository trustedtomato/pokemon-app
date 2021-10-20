export function debounce (delay: number, callback: () => void) {
  let timeoutHandler: ReturnType<typeof setTimeout> | null = null
  return function () {
    if (timeoutHandler !== null) {
      clearTimeout(timeoutHandler)
    }
    // @ts-ignore
    timeoutHandler = setTimeout(callback.bind(this), delay)
  }
}
